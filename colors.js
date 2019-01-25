YUI().use('datatable-sort', 'color-harmony', function (Y) {

    // The source of this data is http://www.w3.org/TR/css3-color/
    var filterBy,
    // pull in json data here
    // ,
    colorData = [
      {name: '$color-artic-blue', hex: '00bcd4'},
      {name: '$color-bat-girl-purple', hex: '544973'},
      {name: '$color-noir', hex: '000000'},
      {name: '$color-black-panther-blue', hex: '262d3f'},
      {name: '$color-royal-panther-purple', hex: '4c5a7f'},
      {name: '$color-boo-grey', hex: 'cacccf'},
      {name: '$color-danger-zone-red', hex: 'd6473d'},
      {name: '$color-dark-sky-blue', hex: 'abccdc'},
      {name: '$color-dark-sky-grey', hex: 'dddddd'},
      {name: '$color-darkseid-blue', hex: '499cc4'},
      {name: '$color-darth-vader-grey', hex: '3a3a3a'},
      {name: '$color-darthvader-xwing-grey', hex: '525865'},
      {name: '$color-death-star-grey', hex: '7a7f88'},
      {name: '$color-dolphins-cove', hex: 'e1e7ea'},
      {name: '$color-dylans-grey', hex: '4f5359'},
      {name: '$color-fancy-mustard', hex: 'e1881d'},
      {name: '$color-finn-white', hex: 'ffffff'},
      {name: '$color-glacier-blue', hex: 'f1fafe'},
      {name: '$color-grape-ape', hex: '424f75'},
      {name: '$color-indigo-girls', hex: '5c6bc0'},
      {name: '$color-iron-sea-blue', hex: '3580a5'},
      {name: '$color-jacks-mannequin', hex: '191E2A'},
      {name: '$color-lakitus-cloud', hex: 'f5f7f8'},
      {name: '$color-lucario-blue', hex: '3580a5'},
      {name: '$color-mystique-blue', hex: '337ab7'},
      {name: '$color-orange-julius', hex: 'ff8a65'},
      {name: '$color-pastel-green', hex: '5bb7ab'},
      {name: '$color-pastel-red', hex: 'e05b4f'},
      {name: '$color-pine-green', hex: '3c8f84'},
      {name: '$color-pmrs-purple', hex: 'ab99c9'},
      {name: '$color-ryu-grey', hex: '9b9da1'},
      {name: '$color-shelby-blue', hex: '40bfff'},
      {name: '$color-silver-mist', hex: 'e5e5e5'},
      {name: '$color-snow-white', hex: 'f7f9fa'},
      {name: '$color-thanos-purple', hex: '6f6198'},
      {name: '$color-wonder-woman-red', hex: 'bc332d'},
      {name: '$color-yield-yellow', hex: 'fa9f47'},
      {name: 'red', hex: 'f44336'},
      {name: 'pink', hex: 'e91e63'},
      {name: 'purple', hex: '9c27b0'},
      {name: 'deep-purple', hex: '673ab7'},
      {name: 'indigo', hex: '3f51b5'},
      {name: 'blue', hex: '2196f3'},
      {name: 'light-blue', hex: '03a9f4'},
      {name: 'cyan', hex: '00bcd4'},
      {name: 'teal', hex: '009688'},
      {name: 'green', hex: '4caf50'},
      {name: 'light-green', hex: '8bc34a'},
      {name: 'lime', hex: 'cddc39'},
      {name: 'yellow', hex: 'ffeb3b'},
      {name: 'amber', hex: 'ffc107'},
      {name: 'orange', hex: 'ff9800'},
      {name: 'deep-orange', hex: 'ff5722'},
      {name: 'brown', hex: '795548'},
      {name: 'grey', hex: '9e9e9e'},
      {name: 'blue-grey', hex: '607d8b'},
      {name: 'white', hex: 'ffffff'},
      {name: 'black', hex: '000000'},
    ];

    /* This takes a hex value and generates a numeric string
    *  in the format "01.23.45"
    *  Each pair of digits represents the Hue, Saturation, or Brightness
    *  of the color in a range of 00 to 99 (always 2 digits).
    *  These strings sort in a more visually logical way for colors.
    *  The sequence of digits can be changed to sort in different ways.
    *  such as hh.ss.bb for sorting first by hue, then saturation,
    *  or bb.hh.ss for sorting first by brightness, then hue, then saturation.
    *  The dots are only for human readability
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
            return hNum + '.' + bNum + '.' + sNum; // hue.bright.sat
        } else if (sortType === "bhs") {
            return bNum + '.' + hNum + '.' + sNum; // bright.hue.sat
        }
    }

    myTable = new Y.DataTable({
        columns: [
            { key: "swatch",
              label: 'Swatch',
              // Use formatter to add a div swatch in each cell
              // Color the background-color from hex value in each row
              formatter: function(o) {
                // return '<div class="swatch" style="' +
                // 'background-color: #' + Y.Escape.html(o.data.hex) + ';' +
                // '"></div>';
// <div class="swatch" style="background-color: #ca0002;">
//   <span class="group">o.data.hex</span>
//   <div class="details">
//     <span class="shade">500</span>
//     <span class="hex">#E91E63</span>
//   </div>
// </div>
                return '<div class="swatch" style="' +
                'background-color: #' + Y.Escape.html(o.data.hex) + ';' +
                'content: "test"; color: white' +
                '"></div>';
              },
              sortable: false,
              allowHTML: true
            },
            { key: "name",
              label: 'Color Name',
              sortable: true
            },
            { key: "hex",
              label: 'Hex',
              sortable: true
            },
            { key: "hbs",
              label: 'Hue',
              sortable: true
            }
            // { key: "bhs",
            //   label: 'Bright',
            //   sortable: true
            // }
        ],
        recordType: {
            swatch: {},
            name: {},
            hex: {},
            hbs: {
                getter: function() {
                    // create a new attribute in the model
                    // and generate a sortable color number
                    // from the hex value for
                    // hue.bright.sat
                    return getColorNum(this.get('hex'), 'hbs');
                }
            },
            bhs: {
                getter: function() {
                    // do the same for bright.hue.sat
                    return getColorNum(this.get('hex'), 'bhs');
                }
            }
        },
        data: colorData,
        sortBy: { hbs: 'desc' } // initial sorting
    }).render("#cTable");

    // listener for swatch size
    Y.one('#small-swatch-checkbox').on('click', function(e) {
        var datatable = Y.one('#cTable .yui3-datatable');

        if (e.target.get('checked')) {
            datatable.addClass('view-small');
        } else {
            datatable.removeClass('view-small');
        }
    });

    // This filters the DataModel to have a subset of it's original
    // data
    function filterModel(filterType) {
        // reset model list to include all colors to prepare for filter
        myTable.set('data', colorData);

        var list = myTable.data,
            filteredData = list.filter({asList: true}, function (list) {
                var hbsStr = list.get('hbs'), // get the hue emphasized color number
                    bright = hbsStr.substring(3, 5), // only the 2 brightness digits
                    sat = hbsStr.substring(6, 8), // only the 2 saturation digits
                    type; // clicked filter type

                // Depending on which filter radio was clicked,
                // filter the DataTable's modelList to include a
                // subset of models/rows/colors
                if (filterType === 'filter-all') {
                    // Don't show black, white, or grays
                    type = sat >= 1;
                } else if (filterType === 'filter-tint') {
                    // Bright colors that are not gray or white
                    type = (bright >= 75) && (sat >= 1);
                } else if (filterType === 'filter-shade') {
                    // Darker colors that are not grayish
                    type = (bright <= 50) && (sat >= 20);
                } else if (filterType === 'filter-midtone') {
                    // Middle brightness colors that are not grayish
                    type = (bright >= 50) && (bright <= 75) && (sat >= 20);
                } else if (filterType === 'filter-mute') {
                    // Low saturation (grayish) but not pure grays
                    type = (sat <= 55) && (sat >= 1);
                } else if (filterType === 'filter-gray') {
                    // Only colors that are completely gray
                    type = sat === '00';
                }

                return type;
            });
        myTable.set('data', filteredData);
    }

    // initial filtering of the dataTable's modelList to muted colors
    filterModel('filter-mute');

    // listen for filter change
    Y.all('.filters').on('click', function(e) {
        filterModel(e.target.get('id'));
    });
});
