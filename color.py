import json
import colorsys
import math
from PIL import Image

##### ORIGINAL JSON
# open json data file
# all material colors and salesloft colors
# with open('colors.json') as json_data:
# material base colors and salesloft colors
with open('colors-translate.json') as json_data:
    data = json.load(json_data)
    allColors = data["colorData"]

##### CONVERSION
# convert hex to rgb
def hex2rgb(hexcode):
    rgb = tuple(map(ord,hexcode[1:].decode('hex')))
    return rgb

# add rgb values to array
for i in allColors:
    colorHex = i['hex']
    rgbvalue = hex2rgb(colorHex)
    i.update({'rgbconvert':rgbvalue})
    # print(i['rgbconvert'])

# when array is python dict
# for i in colorData:
#     colorHex = i['hex']
#     rgbvalue = hex2rgb(colorHex)
#     i.update( {"rgbconvert":rgbvalue})

##### SORTING
# steps
def step (rgb, repetitions=1):
    r,g,b = rgb
    lum = math.sqrt( .241 * r + .691 * g + .068 * b )

    h, s, v = colorsys.rgb_to_hsv(r,g,b)

    h2 = int(h * repetitions)
    lum2 = int(lum * repetitions)
    v2 = int(v * repetitions)

    return (h2, lum2, v2)

# allColors.sort()
# like this one, more like rainbow
allColors.sort(key=lambda rgb: colorsys.rgb_to_hsv(*rgb['rgbconvert']))
allColors.sort(key=lambda rgb: step(rgb['rgbconvert'],4))
# allColors.sort()

# sort by name
# def byname(x):
#     return x['name']
#
# allColors.sort(key = lambda byname : byname['name'])

##### IMAGE
# new list variable for rgb sorted values
rgbList = []

for c in allColors:
    colorHex = c['hex']
    rgbvalue = hex2rgb(colorHex)
    c.update({'rgbconvert':rgbvalue})
    rgbList.append(rgbvalue);

# print new list of sorted rgb values for image creation
# print rgbList

# generate image
lenData = len(rgbList)
im = Image.new("RGB", (lenData, (1)))
im.putdata(rgbList)
size = (lenData, 20)
im = im.resize(size)
im.save('color-palette.png')

##### SORTED JSON
# print rgb values after sort to prep for json dump
for r in allColors:
    rgbval = str(r['rgbconvert']).strip('[]')
    # rgbstr = float(rgbval[1:-1])
    r.update({'rgbconvert':rgbval})
    # print(r['rgbconvert'])

colorData = {"colorData": allColors}

# Writing JSON data into a file called colors-sorted.json
# json.dumps() method turns a Python data structure into JSON
with open('colors-sorted.json', 'w') as f:
    # json.dump(allColors, f)
    json.dump(colorData, f)
