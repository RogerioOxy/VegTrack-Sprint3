from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

root = Path(__file__).resolve().parents[1] / 'assets'
root.mkdir(exist_ok=True)
font = 'C:/Windows/Fonts/arial.ttf'
bold = 'C:/Windows/Fonts/arialbd.ttf'
icon = Image.new('RGB', (1024, 1024), '#14532d')
d = ImageDraw.Draw(icon)
d.ellipse((260, 190, 810, 740), fill='#dcfce7')
d.polygon([(275, 730), (760, 240), (520, 630)], fill='#15803d')
d.line((265, 770, 710, 320), fill='white', width=35)
icon.save(root / 'icon.png')
icon.save(root / 'adaptive-icon.png')
splash = Image.new('RGB', (1080, 1920), '#f8fafc')
splash.paste(icon.resize((240, 240)), (420, 650))
sd = ImageDraw.Draw(splash)
sd.text((540, 960), 'VegTrack', font=ImageFont.truetype(bold, 78), fill='#14532d', anchor='mm')
sd.text((540, 1060), 'Conservação de rodovias', font=ImageFont.truetype(font, 36), fill='#475569', anchor='mm')
splash.save(root / 'splash.png')

# A fotografia licenciada não é gerada por este script. Consulte docs/CREDITOS.md.
print('3 assets gerados: icon, adaptive-icon e splash.')
