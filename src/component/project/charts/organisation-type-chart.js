import React from 'react';
import Chart from "react-google-charts";
// import NumberFormat from "react-number-format"

const OrganisationTypeChart = ({ results }) => {


    // function percentageFormat(num) {
    //     return parseFloat(num.toFixed(2));
    // }

    var $data = [
        [
            'Organisation Type', 
            'Amount',
            // 'Percentage'
        ]
    ];

    const Types = results
        .map(dataItem => dataItem.organisation.type.type) // get all organisation types
        .filter((Type, index, array) => array.indexOf(Type) === index); // filter out duplicates

    const counts = Types
        .map(Type => ({
            type: Type,
            count: results.filter(item => item.organisation.type.type === Type).length,
            total: results.length
        }));


    counts.forEach(element => {
        $data.push([
            element.type,
            element.count

            // test calculate the percentage manually (only works with  pieSliceText: 'value',)
            // instead of adding element.count  use one of these lines
            // 100 / element.total * element.count  // needs formating for 2 digits
            // percentageFormat(100 / element.total * element.count)
            
            // doesn't work as the chart requires a value not a string.
            // error thrown Uncaught (in promise) Error: Unknown type of value, [object Object] ?
            // <NumberFormat
            //     value={100 / element.total * element.count}
            //     thousandSeparator = { ' '}
            //     displayType = { 'text'}
            //     prefix = { '%'}
            // />
        ]);
    });


    // google pie chart renders perceante only with 1 digit. which results in 100.1% total value
    // i tried to add the percentage data but this produces other issues.
    // console.log(['data', $data]);

    const pieOptions = {
        title: "Partners by organisation type",
        // pieHole: 0.6,
        // different colors
        // slices: [
        //     {
        //         color: "#2BB673"
        //     },
        //     {
        //         color: "#d91e48"
        //     },
        //     {
        //         color: "#007fad"
        //     },
        //     {
        //         color: "#e9a227"
        //     }
        // ],

        // bottom legend has a rendering issue (legend text isn't displayed) :(  
        // first i thought it's the color (because on color change it is rendered correctly. but not on reload.)
        // legend: {
        //     position: "bottom",
        //     alignment: "center",
        //     textStyle: {
        //         // color: "#233238",
        //         // color: "#000000",
        //         // color: "#2BB673",
        //         fontSize: 14
        //     }
        // },
        // chartArea: {
        //     left: 0,
        //     top: 0,
        //     width: "100%",
        //     height: "80%"
        // },

        tooltip: {
            showColorCode: true
        },

        // test to display perceantage value directly        
        // pieSliceText: 'value',
    };

    return (
        <React.Fragment>

            {/* title by the chart or manual chart? */}
            {/* <h3>Partners by organisation type</h3> */}
            <Chart
                width={'500px'}
                height={'300px'}
                chartType="PieChart"
                loader={<div>Loading Chart</div>}
                data={$data}
                options={pieOptions}
                // graphID="PartnersByOrganisationTypeChart"
                rootProps={{ 'data-testid': '1' }}
            />
        </React.Fragment>
    );
}

export default OrganisationTypeChart;