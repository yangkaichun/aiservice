#!/usr/bin/env python3
"""修正 JS 字典檔內單引號字串中的未逸出撇號 — 從 key 後的引號開始配對"""
import re, sys

def fix_file(path):
    s = open(path).read()
    out = []
    i = 0
    n = len(s)
    changed = False
    # 找 `: '` 或 `('` 開頭的字典字串值
    # 模式：冒號+空白+單引號 開始的字串值
    while i < n:
        c = s[i]
        if c == ':' and i + 1 < n:
            # 跳過空白
            j = i + 1
            while j < n and s[j] in ' \t':
                j += 1
            if j < n and s[j] == "'":
                # 找到字串開始 (j)，掃描到配對結尾
                k = j + 1
                while k < n:
                    if s[k] == '\\':
                        k += 2
                        continue
                    if s[k] == "'":
                        break
                    k += 1
                if k < n:
                    inner = s[j+1:k]
                    if "'" in inner:
                        # 內部有未逸出撇號（排除已逸出的 \'）
                        fixed = []
                        m = 0
                        while m < len(inner):
                            if inner[m] == '\\' and m + 1 < len(inner):
                                fixed.append(inner[m:m+2])
                                m += 2
                                continue
                            if inner[m] == "'":
                                fixed.append("\\'")
                                changed = True
                                m += 1
                                continue
                            fixed.append(inner[m])
                            m += 1
                        inner = ''.join(fixed)
                    out.append(s[i:j] + "'" + inner + "'")
                    i = k + 1
                    continue
        out.append(c)
        i += 1
    s2 = ''.join(out)
    if changed:
        open(path, 'w').write(s2)
        print('FIXED', path)
    else:
        print('ok   ', path)

if __name__ == '__main__':
    for f in sys.argv[1:]:
        fix_file(f)
