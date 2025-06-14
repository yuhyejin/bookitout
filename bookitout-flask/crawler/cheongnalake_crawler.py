import time
import re
import logging
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from bs4 import BeautifulSoup

# 로깅 설정
logging.basicConfig(
    filename='/app/crawler.log',
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

class CheongnaLakeLibraryCrawler:
    def __init__(self):
        self.URL = "https://www.michuhollib.go.kr/cnl/sch/bsch/list.do?mnidx=414"

    def get_book_status(self, book_title: str):
        options = Options()
        options.add_argument("--headless=new")
        options.add_argument("--no-sandbox")
        options.add_argument("--disable-dev-shm-usage")
        options.add_argument("--window-size=1920,1080")
        options.binary_location = "/usr/bin/chromium"

        driver = webdriver.Chrome(service=Service("/usr/bin/chromedriver"), options=options)

        try:
            logging.info(f"'{book_title}' 책을 위해 청라호수도서관 크롤링 시작...")
            driver.get(self.URL)

            # 페이지가 완전히 로드될 때까지 대기
            WebDriverWait(driver, 20).until(
                lambda driver: driver.execute_script("return document.readyState") == "complete"
            )
            time.sleep(3)
            logging.info("페이지 로드 완료")

            # 검색어 입력 필드에 책 제목 입력
            search_input = WebDriverWait(driver, 20).until(
                EC.element_to_be_clickable((By.ID, "searchKeyword"))
            )
            search_input.clear()
            search_input.send_keys(book_title)
            logging.info(f"검색어 '{book_title}' 입력 완료")

            # JavaScript 함수 직접 호출
            driver.execute_script("fn_nomalKeywordSearch();")
            logging.info("검색 실행 완료")
            time.sleep(3)

            # 검색 결과가 로드될 때까지 대기
            WebDriverWait(driver, 20).until(
                EC.presence_of_element_located((By.CSS_SELECTOR, "#bookSearchList li"))
            )
            time.sleep(3)
            logging.info("검색 결과 로드 완료")

            # 검색 결과 파싱
            soup = BeautifulSoup(driver.page_source, "html.parser")
            book_elements = soup.select("#bookSearchList li")
            books_data = []

            if not book_elements:
                logging.info("검색 결과가 없습니다.")
                return []

            logging.info(f"검색된 책 수: {len(book_elements)}")

            for book_element in book_elements:
                try:
                    title = book_element.select_one("p.textOF2.title a").text.strip()
                    pub_info_text = book_element.select_one("span.name").text.strip()
                    
                    # 출판 정보 파싱
                    parts = pub_info_text.split(' / ')
                    publication_year = parts[0].replace("발행연도 - ", "").strip() if len(parts) > 0 and "발행연도 -" in parts[0] else ""
                    author = parts[1].replace("지음: ", "").strip() if len(parts) > 1 and "지음:" in parts[1] else ""
                    publisher = parts[2].replace(" :", "").strip() if len(parts) > 2 else ""

                    # 도서관 정보 파싱
                    library = ""
                    shelf_location = ""
                    registration_number = ""
                    isbn = ""
                    call_number = ""

                    pginfo_elements = book_element.select("ul.pginfo li")
                    for info_li in pginfo_elements:
                        text = info_li.text.strip()
                        if "도서관" in text:
                            library = text.replace("도서관", "").strip()
                        elif "자료실" in text:
                            shelf_location = text.replace("자료실", "").strip()
                        elif "등록번호" in text:
                            registration_number = text.replace("등록번호", "").strip()
                        elif "ISBN" in text:
                            isbn = text.replace("ISBN", "").strip()
                        elif "청구기호" in text:
                            call_number = text.replace("청구기호", "").strip()

                    # 청라호수도서관 책만 처리
                    if library != "청라호수":
                        continue

                    # 대출 상태 및 예약 정보 파싱
                    availability_div = book_element.select_one("div.libro_alquilar")
                    availability_text = availability_div.text.strip() if availability_div else ""
                    
                    loan = "대출가능" if "대출가능" in availability_text else "대출불가"
                    
                    # 예약 정보
                    reservation_count = "0"
                    reservation_match = re.search(r'예약 (\d+)명', availability_text)
                    if reservation_match:
                        reservation_count = reservation_match.group(1)

                    reservation_status = "예약가능"
                    reser_element = book_element.select_one("a.reser")
                    if reser_element and "no" in reser_element.get("class", []):
                        reservation_status = f"예약불가능 예약 {reservation_count}명"

                    # 반납예정일
                    return_date = None
                    return_date_match = re.search(r'반납예정일 (\d{4}-\d{2}-\d{2})', availability_text)
                    if return_date_match:
                        return_date = return_date_match.group(1)

                    # 이미지 URL
                    image_url = ""
                    img_element = book_element.select_one("li.centerimg img")
                    if img_element and img_element.get("src"):
                        image_url = img_element.get("src")

                    # 상호대차 가능 여부
                    interlibrary = "불가능"
                    interlibrary_element = book_element.select_one("a.cambiar")
                    if interlibrary_element and "no" not in interlibrary_element.get("class", []):
                        interlibrary = "가능"

                    books_data.append({
                        "title": title,
                        "author": author,
                        "publisher": publisher,
                        "year": publication_year,
                        "loan": loan,
                        "return_date": return_date,
                        "reservation": reservation_status,
                        "library": library,
                        "shelf_loc": shelf_location,
                        "call_number": call_number,
                        "interlibrary": interlibrary,
                        "image_url": image_url
                    })
                    logging.info(f"책 정보 파싱 완료: {title}")

                except Exception as e:
                    logging.error(f"책 정보 파싱 중 오류: {e}")
                    continue

            logging.info(f"총 {len(books_data)}개의 책 정보 수집 완료")
            return books_data

        except Exception as e:
            logging.error(f"크롤링 중 오류 발생: {e}")
            return []
        finally:
            driver.quit()

