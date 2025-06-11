from flask import Flask, request, jsonify
from crawler_manager import get_crawler
import traceback

app = Flask(__name__)

@app.route('/crawl', methods=['GET'])
def crawl():
    library = request.args.get('library')
    title = request.args.get('title')

    if not library or not title:
        return jsonify({"error": "Missing 'library' or 'title' parameter"}), 400

    crawler = get_crawler(library)
    if crawler is None:
        return jsonify({"error": f"Unsupported library code: {library}"}), 404

    try:
        result = crawler.get_book_status(title)
        return jsonify(result)
    except Exception as e:
        print("[에러 발생]", e)
        traceback.print_exc() 
        return jsonify({"error": str(e)}), 500

@app.route('/has_crawler', methods=['GET'])
def has_crawler():
    library_name = request.args.get('library')
    if not library_name:
        return jsonify({"error": "Missing 'library' parameter"}), 400

    crawler_exists = get_crawler(library_name) is not None
    return jsonify({"has_crawler": crawler_exists})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)
