var getdata;

// get json data from sorted colors
$.ajax({
  async: false,
  url: 'colors-translate.json',
  data: "",
  accepts:'application/json',
  dataType: 'json',
  success: function (response) {
    // console.log(response)
    getdata = response;
  }
})

// Flat swatch list in template
// var source = $("#color-template").html();
// var template = Handlebars.compile(source);
// $('body').append(template(getdata));

// console.log(getdata);
dataAll = getdata['colorData'];

// filter function find word in string
function filterByValue(array, string) {
  return array.filter(o =>
      Object.keys(o).some(k => o[k].toLowerCase().includes(string.toLowerCase())));
}

// Color filters
// console.log(filterByValue(dataAll, 'red'));
// var nameBlueGrey = dataAll.find( colorname => colorname.name === 'blue-grey' );
// console.log(nameBlueGrey);

// var dataWarm = dataRed.concat(dataPink, dataOrange, dataYellow, dataAmber);

var dataAmber = filterByValue(dataAll, 'amber');
var dataAqua = filterByValue(dataAll, 'aqua');
var dataBlack = filterByValue(dataAll, 'black');
var dataBlue = filterByValue(dataAll, 'blue');
var dataBlueGrey = filterByValue(dataAll, 'temp');
var dataCyan = filterByValue(dataAll, 'cyan');
var dataGreen = filterByValue(dataAll, 'green');
var dataGrey = filterByValue(dataAll, 'grey');
var dataIndigo = filterByValue(dataAll, 'indigo');
var dataLime = filterByValue(dataAll, 'lime');
var dataOrange = filterByValue(dataAll, 'orange');
var dataPink = filterByValue(dataAll, 'pink');
var dataPurple = filterByValue(dataAll, 'purple');
var dataRed = filterByValue(dataAll, 'red');
var dataTeal = filterByValue(dataAll, 'teal');
var dataWhite = filterByValue(dataAll, 'white');
var dataYellow = filterByValue(dataAll, 'yellow');

var dataReducedPalette = filterByValue(dataAll, '$color');
// var dataReds = dataRed.concat(dataPink);
var dataBurnt = dataOrange.concat(dataAmber);
var dataYellows = dataYellow.concat(dataAmber);
var dataCool = dataBlue.concat(dataCyan);
var dataPrince = dataPurple.concat(dataIndigo);
var dataIndie = dataIndigo.concat(dataBlue);
var dataCyan = dataCyan.concat(dataTeal);
// var dataGreens = dataGreen.concat(dataLime);
var dataOther = dataWhite.concat(dataBlack);

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

    columnformat = [
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
    ]

    recordformat = {
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
    }
    //
    // swatchesAll = new Y.DataTable({
    //     columns: columnformat,
    //     recordType: recordformat,
    //     data: dataAll,
    //     sortBy: { bhs: 'asc' }
    // }).render("#swatchesAll");

    // swatchesReducedPalette = new Y.DataTable({
    //   columns: columnformat, recordType: recordformat, data: dataReducedPalette, sortBy: { bhs: 'asc' }
    // }).render("#swatchesReducedPalette");

    swatchesRed = new Y.DataTable({
      columns: columnformat, recordType: recordformat, data: dataRed, sortBy: { bhs: 'asc' }
    }).render("#swatchesRed");

    swatchesIndigo = new Y.DataTable({
      columns: columnformat, recordType: recordformat, data: dataIndigo, sortBy: { bhs: 'asc' }
    }).render("#swatchesIndigo");

    swatchesBlue = new Y.DataTable({
      columns: columnformat, recordType: recordformat, data: dataBlue, sortBy: { bhs: 'asc' }
    }).render("#swatchesBlue");

    swatchesTeal = new Y.DataTable({
      columns: columnformat, recordType: recordformat, data: dataTeal, sortBy: { bhs: 'asc' }
    }).render("#swatchesTeal");

    swatchesGreen = new Y.DataTable({
      columns: columnformat, recordType: recordformat, data: dataGreen, sortBy: { bhs: 'asc' }
    }).render("#swatchesGreen");

    swatchesOrange = new Y.DataTable({
      columns: columnformat, recordType: recordformat, data: dataOrange, sortBy: { bhs: 'asc' }
    }).render("#swatchesOrange");

    swatchesGrey = new Y.DataTable({
      columns: columnformat, recordType: recordformat, data: dataGrey, sortBy: { bhs: 'asc' }
    }).render("#swatchesGrey");

    // swatchesBlueGrey = new Y.DataTable({
    //   columns: columnformat, recordType: recordformat, data: dataBlueGrey, sortBy: { bhs: 'asc' }
    // }).render("#swatchesBlueGrey");

    swatchesOther = new Y.DataTable({
      columns: columnformat, recordType: recordformat, data: dataOther, sortBy: { bhs: 'asc' }
    }).render("#swatchesOther");

});
