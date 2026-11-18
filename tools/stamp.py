"""公開の前に実行する。HTML内の assets/ への参照に ?v=<ファイルの中身から作った短い番号> を付ける。
中身が変わったファイルだけ番号が変わるので、見る人のブラウザに古い画像やデザインが残らない。"""
import hashlib, pathlib, re
root = pathlib.Path(__file__).resolve().parent.parent
def ver(path):
    p = root / path
    return hashlib.sha1(p.read_bytes()).hexdigest()[:8] if p.exists() else None
for html in root.glob('*.html'):
    s = html.read_text(encoding='utf-8')
    def rep(m):
        path = m.group(1); v = ver(path)
        return f'{path}?v={v}' if v else path
    s2 = re.sub(r'(assets/[^"\'()?\s]+)(?:\?v=[0-9a-f]+)?', rep, s)
    if s2 != s:
        html.write_text(s2, encoding='utf-8'); print('stamped', html.name)
