var getdata;

// get json data from sorted colors
$.ajax({
  async: false,
  url: 'colors-sorted.json',
  data: "",
  accepts:'application/json',
  dataType: 'json',
  success: function (response) {
    // console.log(response)
    getdata = response;
  }
})

// console.log(getdata);
myData = getdata['colorData'];

// Flat swatch list in template
// var source = $("#color-template").html();
// var template = Handlebars.compile(source);
// $('body').append(template(getdata));

// filter function find word in string
function filterByValue(array, string) {
    return array.filter(o =>
        Object.keys(o).some(k => o[k].toLowerCase().includes(string.toLowerCase())));
}

colors_red = filterByValue(myData, 'red');
// console.log(filterByValue(myData, 'red'));
// console.log(colors_red);
// const result = myData.find( colorname => colorname.name === 'red' );

// interactive data table
YUI().use('datatable-sort', 'color-harmony', function (Y) {
    // About colors http://www.w3.org/TR/css3-color/
    var filterBy

    /* Take hex value and generate a numeric string in the format "01, 23, 45"
    *  Each pair represents the Hue, Saturation, or Brightness
    *  These strings sort in a more visually logical way for colors
    *  The sequence of digits can be changed to sort in different ways
    *  hh, ss, bb for sorting first by hue, then saturation, bb, hh, ss for sorting first by brightness, then hue, then saturation.
    */
    function getColorNum(hex, sortType) {
        // An array of color property values
        // [hue, saturation, lightness]
        var HSL = Y.Color.toArray(Y.Color.toHSL(hex)),
          hNum, // hue
          sNum, // saturation
          // get the computed brightness from the hex value
          bNum = Y.Color.getBrightness(hex).toString();

        // isolate hue part from HSL. converted to 2 digits
        // hNum = Math.floor((HSL[0] * 10) / 36.01).toString();
        hNum = Math.floor(HSL[0]).toString();
        // hNum = (hNum.length < 2) ? ('0' + hNum) : hNum;
        hNum = (hNum.length < 2) ? ('0' + hNum) : hNum;
        hNum = (hNum.length < 3) ? ('0' + hNum) : hNum;

        // isolate sat part from HSL. converted to 2 digits
        // sNum = Math.floor((HSL[1] * 10) / 10.01).toString();
        sNum = Math.floor(HSL[1]).toString();
        sNum = (sNum.length < 2) ? ('0' + sNum) : sNum;

        // assure brightness is 2 digits
        bNum = (bNum.length < 2) ? ('0' + bNum) : bNum;
        bNum = (bNum === "100") ? "99" : bNum;

        if (sortType === "hbs") {
          return hNum + ', ' + bNum + ', ' + sNum; // hue, bright, sat
        } else if (sortType === "bhs") {
          return bNum + ', ' + hNum + ', ' + sNum; // bright, hue, sat
        }
    }

    myTable = new Y.DataTable({
        columns: [
            { key: "swatch",
              label: 'Swatch',
              // Use formatter to add a div swatch in each cell with background color hex
              formatter: function(o) {
                return '<div class="swatch" style="padding: 8px 0 0 8px; color: rgba(255,255,255,0.2); ' +
                // 'background-color: #' + Y.Escape.html(o.data.hex) + ';' +
                'background-color: ' + Y.Escape.html(o.data.hex) + ';' +
                '">' + Y.Escape.html(o.data.name) + '</div>';
              },
              sortable: false,
              allowHTML: true
            },
            { key: "name",
              label: 'Color Name',
              formatter: function(o) {
                return '<div class="name">' + Y.Escape.html(o.data.name) + '</div>';
              },
              sortable: true,
              allowHTML: true
            },
            { key: "hex",
              label: 'Hex',
              sortable: true
            },
            { key: "rgbconvert",
              label: 'RGB',
              sortable: true
            },
            { key: "hbs",
              label: 'Hue',
              sortable: true
            },
            { key: "bhs",
              label: 'Bright',
              sortable: true
            }
        ],
        recordType: {
            swatch: {},
            name: {},
            hex: {},
            rgb: {},
            hbs: {
                getter: function() {
                    // Create new attr in model and generate sortable color number from hex value for hue, bright, sat
                    return getColorNum(this.get('hex'), 'hbs');
                }
            },
            bhs: {
                getter: function() {
                    // do the same for bright, hue, sat
                    return getColorNum(this.get('hex'), 'bhs');
                }
            }
        },
        data: colors_red,
        sortBy: { bhs: 'desc' } // initial sorting
    }).render("#cTable");
});
