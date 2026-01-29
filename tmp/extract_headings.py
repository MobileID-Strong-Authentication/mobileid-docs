import re
from html.parser import HTMLParser

class HeadingExtractor(HTMLParser):
    def __init__(self):
        super().__init__()
        self.headings = []
        self.current_tag = None
        self.current_text = ""
        
    def handle_starttag(self, tag, attrs):
        if tag in ['h1', 'h2', 'h3']:
            self.current_tag = tag
            self.current_text = ""
            
    def handle_endtag(self, tag):
        if tag in ['h1', 'h2', 'h3'] and self.current_tag == tag:
            text = self.current_text.strip()
            if text and len(text) > 1:
                # Remove leading numbers like "1.", "1.1", etc.
                text = re.sub(r'^\d+(\.\d+)*\s*', '', text)
                self.headings.append((tag, text))
            self.current_tag = None
            self.current_text = ""
            
    def handle_data(self, data):
        if self.current_tag:
            self.current_text += data

with open('/Users/phaupt/Documents/git/mobileid-docs/tmp/mobile-id-reference-guide-v-3-12.html', 'r', encoding='utf-8') as f:
    content = f.read()
    
parser = HeadingExtractor()
parser.feed(content)

for tag, heading in parser.headings:
    indent = "  " * (int(tag[1]) - 1)
    print(f"{indent}{heading}")
