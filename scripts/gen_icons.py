#!/usr/bin/env python3
"""Генератор иконок NRadio: лого «эквалайзер» (вариант C со стенда).

Рисует оранжевый скруглённый квадрат (#E95420) с тремя тёмными
полосками (#1B1922) — геометрия из Header.module.scss 1:1 (сетка 26 ед.):
полоски шириной 3, зазор 2, высоты 9/14/7, радиус угла квадрата 7.
Без PIL: PNG собирается вручную (zlib + struct), антиалиасинг —
суперсэмплинг 4x4 на пиксель.
"""
import zlib, struct, os

ACCENT = (233, 84, 32)    # #E95420
DARK = (27, 18, 34)       # #1B1922 (Yaru bg)

S = 4  # суперсэмплинг


def inside_rounded_rect(x, y, cx, cy, hw, hh, r):
    """SDF rounded-rect: центр (cx,cy), полуширина hw, полувысота hh, радиус r."""
    qx = max(abs(x - cx) - (hw - r), 0.0)
    qy = max(abs(y - cy) - (hh - r), 0.0)
    return qx * qx + qy * qy <= r * r


def render(size, maskable=False, apple=False):
    """RGBA-строки канвы size x size.

    - обычные иконки: прозрачный фон + скруглённый квадрат во всю канву
    - maskable: полная заливка акцентом (без скруглений), полоски в safe-zone 80%
    - apple: полная заливка акцентом, полоски 100% (Apple сам скругляет)
    """
    u = size / 26.0
    cx = cy = size / 2.0
    r = 7.0 * u
    bar_w, gap = 3.0 * u, 2.0 * u
    scale = 0.8 if maskable else 1.0
    bw = bar_w * scale
    heights = [9.0 * u * scale, 14.0 * u * scale, 7.0 * u * scale]
    # центры полосок по X: 8, 13, 18 (в единицах сетки 26)
    bar_centers = [8.0 * u, 13.0 * u, 18.0 * u]
    bars = []
    for bcx, h in zip(bar_centers, heights):
        bars.append((bcx - bw / 2, cy - h / 2, bcx + bw / 2, cy + h / 2, 1.0 * u * scale))

    rows = []
    for py in range(size):
        row = bytearray()
        for px in range(size):
            acc = [0, 0, 0, 0]  # RGBA накопление по 16 сабсэмплам
            for sy in range(S):
                for sx in range(S):
                    x = px + (sx + 0.5) / S
                    y = py + (sy + 0.5) / S
                    # квадрат-подложка
                    if maskable or apple:
                        bg_hit = True
                    else:
                        bg_hit = inside_rounded_rect(x, y, cx, cy, cx, cy, r)
                    # полоски
                    bar_hit = False
                    for x0, y0, x1, y1, br in bars:
                        if inside_rounded_rect(x, y, (x0 + x1) / 2, (y0 + y1) / 2,
                                               (x1 - x0) / 2, (y1 - y0) / 2, br):
                            bar_hit = True
                            break
                    if bar_hit:
                        col, a = DARK, 255
                    elif bg_hit:
                        col, a = ACCENT, 255
                    else:
                        col, a = (0, 0, 0), 0
                    acc[0] += col[0]; acc[1] += col[1]; acc[2] += col[2]; acc[3] += a
            n = S * S
            row += bytes((acc[0] // n, acc[1] // n, acc[2] // n, acc[3] // n))
        rows.append(bytes(row))
    return rows


def png_bytes(rows):
    h = len(rows)
    w = len(rows[0]) // 4
    def chunk(tag, data):
        return (struct.pack('>I', len(data)) + tag + data
                + struct.pack('>I', zlib.crc32(tag + data) & 0xFFFFFFFF))
    ihdr = struct.pack('>IIBBBBB', w, h, 8, 6, 0, 0, 0)
    raw = b''.join(b'\x00' + r for r in rows)
    return (b'\x89PNG\r\n\x1a\n' + chunk(b'IHDR', ihdr)
            + chunk(b'IDAT', zlib.compress(raw, 9)) + chunk(b'IEND', b''))


def ico_bytes(sizes_png):
    n = len(sizes_png)
    out = struct.pack('<HHH', 0, 1, n)
    offset = 6 + 16 * n
    entries, data = b'', b''
    for size, png in sizes_png:
        entries += struct.pack('<BBBBHHII', size % 256, size % 256, 0, 0, 1, 32, len(png), offset)
        data += png
        offset += len(png)
    return out + entries + data


BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def write(path, data):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'wb') as f:
        f.write(data)
    print('ok', path, len(data), 'bytes')


# PNG-иконки
for size, name in [(64, 'favicon-64.png'), (180, 'apple-touch-icon.png'),
                   (192, 'icon-192.png'), (512, 'icon-512.png')]:
    rows = render(size, apple=(name == 'apple-touch-icon.png'))
    write(os.path.join(BASE, 'public/icons', name), png_bytes(rows))

for size in (192, 512):
    rows = render(size, maskable=True)
    write(os.path.join(BASE, f'public/icons/icon-maskable-{size}.png'), png_bytes(rows))

# favicon.ico: 16 + 32 + 48
ico = ico_bytes([(s, png_bytes(render(s))) for s in (16, 32, 48)])
write(os.path.join(BASE, 'src/app/favicon.ico'), ico)
