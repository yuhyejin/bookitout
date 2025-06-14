import time
import re
import tempfile
import shutil
import os
import uuid

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options

class CheongnaLakeLibraryCrawler:
    def __init__(self):
        self.URL = "https://www.michuhollib.go.kr/cnl/sch/bsch/list.do?mnidx=414"

    def get_book_status(self, book_title: str):
        # 더 고유한 사용자 데이터 디렉토리 생성
        user_data_dir = f"/tmp/chrome_user_data_{uuid.uuid4()}"

        # WebDriver 설정
        options = Options()
        options.add_argument("--headless=new")  # headless 모드 활성화
        options.add_argument("--no-sandbox")
        options.add_argument("--disable-dev-shm-usage")
        options.add_argument("--window-size=1920,1080")
        options.binary_location = "/usr/bin/chromium"
        options.add_argument(f"--user-data-dir={user_data_dir}")
        options.add_argument("--disable-gpu")  # GPU 가속 비활성화
        options.add_argument("--disable-software-rasterizer")  # 소프트웨어 래스터라이저 비활성화

        driver = webdriver.Chrome(service=Service("/usr/bin/chromedriver"), options=options)

        try:
            print(f"'{book_title}' 책을 위해 청라호수도서관 크롤링 시작...")
            driver.get(self.URL)

            WebDriverWait(driver, 20).until(
                lambda d: d.execute_script("return document.readyState") == "complete"
            )
            time.sleep(3)

            search_input = WebDriverWait(driver, 20).until(
                EC.element_to_be_clickable((By.ID, "searchKeyword"))
            )
            search_input.clear()
            search_input.send_keys(book_title)
            print(f"검색어 '{book_title}' 입력 완료.")

            search_button = WebDriverWait(driver, 20).until(
                EC.element_to_be_clickable((By.CSS_SELECTOR, "a.libro_search"))
            )
            search_button.click()
            print("검색 버튼 클릭 완료.")

            WebDriverWait(driver, 20).until(
                EC.presence_of_element_located((By.ID, "bookSearchList"))
            )
            time.sleep(3)

            book_elements = driver.find_elements(By.CSS_SELECTOR, "#bookSearchList > div > ul.prglist > li")
            books_data = []

            if not book_elements:
                print("검색 결과가 없습니다.")
                return []

            for book_element in book_elements:
                title = author = publisher = publication_year = ""
                library = shelf_location = registration_number = isbn = call_number = ""
                return_date = image_url = ""
                interlibrary = "불가능"

                try:
                    title = book_element.find_element(By.CSS_SELECTOR, "p.textOF2.title a").text.strip()
                except:
                    pass

                try:
                    pub_info_text = book_element.find_element(By.CSS_SELECTOR, "span.name").text.strip()
                    parts = pub_info_text.split(' / ')
                    if len(parts) > 0 and "발행연도 -" in parts[0]:
                        publication_year = parts[0].replace("발행연도 - ", "").strip()
                    if len(parts) > 1 and "지음:" in parts[1]:
                        author = parts[1].replace("지음: ", "").strip()
                    if len(parts) > 2:
                        publisher = parts[2].replace(" :", "").strip()
                except:
                    pass

                try:
                    for info_li in book_element.find_elements(By.CSS_SELECTOR, "ul.pginfo li"):
                        text = info_li.text
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
                except:
                    pass

                if library != "청라호수":
                    continue

                try:
                    availability_text = book_element.find_element(By.CSS_SELECTOR, "div.libro_alquilar").text.strip()
                    loan = "대출가능" if "대출가능" in availability_text else "대출불가"

                    reservation_count = "0"
                    match = re.search(r'예약 (\d+)명', availability_text)
                    if match:
                        reservation_count = match.group(1)

                    try:
                        reser = book_element.find_element(By.CSS_SELECTOR, "a.reser")
                        reservation_status_text = (
                            f"예약불가능 예약 {reservation_count}명"
                            if "no" in reser.get_attribute("class")
                            else "예약가능"
                        )
                    except:
                        reservation_status_text = f"예약불가능 예약 {reservation_count}명"

                    match = re.search(r'반납예정일 (\d{4}-\d{2}-\d{2})', availability_text)
                    if match:
                        return_date = match.group(1)

                    try:
                        image_url = book_element.find_element(By.CSS_SELECTOR, "li.centerimg img").get_attribute("src")
                    except:
                        pass

                    try:
                        interlibrary_element = book_element.find_element(By.CSS_SELECTOR, "a.cambiar")
                        if "no" not in interlibrary_element.get_attribute("class"):
                            interlibrary = "가능"
                    except:
                        pass

                    books_data.append({
                        "title": title,
                        "author": author,
                        "publisher": publisher,
                        "year": publication_year,
                        "loan": loan,
                        "return_date": return_date,
                        "reservation": reservation_status_text,
                        "library": library,
                        "shelf_loc": shelf_location,
                        "call_number": call_number,
                        "interlibrary": interlibrary,
                        "image_url": image_url,
                    })

                except Exception as e:
                    print(f"대출 정보 파싱 중 오류: {e}")
                    continue

            return books_data

        except Exception as e:
            print(f"크롤링 중 오류 발생: {e}")
            return []

        finally:
            driver.quit()
            if os.path.exists(user_data_dir):
                try:
                    shutil.rmtree(user_data_dir)
                    print(f"사용자 데이터 디렉토리 {user_data_dir} 삭제 완료.")
                except Exception as cleanup_error:
                    print(f"임시 디렉토리 삭제 실패: {cleanup_error}")
