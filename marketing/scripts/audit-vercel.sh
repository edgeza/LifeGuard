#!/bin/bash
# Audit script - runs all curls, processes output, prints summary
cd /c/Users/juan/AppData/Local/Temp
rm -rf lg-audit 2>/dev/null
mkdir -p lg-audit
cd lg-audit

# Fetch all pages into one HTML file (concatenated with markers)
{
echo "===MARKER=== /"
curl -s -m 8 https://life-guard-marketing.vercel.app/
echo ""
for url in /products /pricing /docs /about /care /care/architecture /care/onboarding /login /signup /compare /for-whom /integration /trust /changelog /careers /status; do
  echo "===MARKER=== $url"
  curl -s -m 8 https://life-guard-marketing.vercel.app$url
  echo ""
done
} > all.html

wc -c all.html

echo ""
echo "=== Quick text audit ==="
python -c "
import re
html = open('all.html').read()
chunks = re.split(r'===MARKER=== (\S+)', html)
# chunks is ['', '/', '<html>...</html>', '/products', '<html>...</html>', ...]
for i in range(1, len(chunks)-1, 2):
    url = chunks[i]
    body = chunks[i+1]
    if not body.strip():
        print(f'{url:<28} EMPTY/FAILED')
        continue
    title = re.search(r'<title>([^<]+)</title>', body)
    title = title.group(1) if title else '?'
    h1 = re.search(r'<h1[^>]*>(.*?)</h1>', body, re.DOTALL)
    h1 = re.sub(r'<[^>]+>', '', h1.group(1)).strip()[:80] if h1 else '?'
    n_inputs = len(re.findall(r'<input[^>]+type=\"email\"', body))
    n_passwords = len(re.findall(r'<input[^>]+type=\"password\"', body))
    sso = 'SSO+mag' if ('Continue with SSO' in body and 'magic link' in body.lower()) else ''
    has_form = 'method=\"post\"' in body or '<form' in body.lower()
    flags = []
    if n_inputs: flags.append(f'{n_inputs}email')
    if n_passwords: flags.append(f'{n_passwords}pw')
    if sso: flags.append(sso)
    print(f'{url:<28} {title[:35]:<35} h1={h1[:30]}  {(\" \".join(flags))}')
"
