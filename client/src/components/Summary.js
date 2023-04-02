import Plot from 'react-plotly.js';

// component for pie chart and reliability graph under Summary tab
export default function Summary({leftdata, rightdata, centerdata, numleft, numcenter, numright}) {
    return (
        <div>
            <div>
            <Plot
                data={[
                {
                    values: [numleft, numcenter, numright],
                    labels: ['Left', 'Center', 'Right'],
                    marker: {
                        colors: ['rgb(51, 102, 255)', 'rgb(191, 191, 191)', 'rgb(255, 51, 51)']
                    },
                    type: 'pie'
                },]}
                layout={ {width: 360, height: 360, title: 'Article Distribution', 
                    xaxis: {title:'Bias'}, 
                    yaxis: {title:'Reliability'}} }
            />

            </div>
            <Plot
                data={[
                {
                    x: leftdata[2],
                    y: leftdata[1],
                    text:leftdata[0],
                    type: 'scatter',
                    mode: 'markers',
                    marker: {color: 'blue'},
                    name: 'Left',
                },
                {
                    x: centerdata[2],
                    y: centerdata[1],
                    text: centerdata[0],
                    type: 'scatter',
                    mode: 'markers',
                    marker: {color: 'grey'},
                    name: 'Center'
                },
                {
                    x: rightdata[2],
                    y: rightdata[1],
                    text: rightdata[0],
                    type: 'scatter',
                    mode: 'markers',
                    marker: {color: 'red'},
                    name: 'Right'
                },
                ]}
                layout={ {width: 360, height: 360, title: 'Article Biases', 
                    xaxis: {title:'Bias'}, 
                    yaxis: {title:'Reliability'}} }
            />
        </div>
    )

}
