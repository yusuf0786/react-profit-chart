import axios from "axios";
import { theme } from './assets/theme/Theme'
import '../src/assets/sass/style.scss'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { ThemeProvider } from '@emotion/react';
import { Barchart } from './components/barchart/Barchart';
import { useState } from "react";
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";

var companies: any = await axios.get("https://recruit.reportingframework.com/file/companies.json/");
var materials: any = await axios.get("https://recruit.reportingframework.com/file/14956524-d310-4109-acc4-0ec63e07d06b/");
var recycling2020: any = await axios.get("https://recruit.reportingframework.com/file/74354dae-7c32-4ba1-ad97-cce83515c911/");
var recycling2021: any = await axios.get("https://recruit.reportingframework.com/file/14d4af25-d3c0-4683-aac1-7f97ae2ddcbf/");

var companiesData = companies.data

var materialsData = materials.data

var recyclingData2020 = recycling2020.data
var recyclingData2021 = recycling2021.data

var data2020_WithCompanyId = [...recyclingData2020]
var data2021_WithCompanyId = [...recyclingData2021]

var companyId = companiesData.map((item: any) => item.COMPANYID)

// Adding Data to there Company Id wise
function companyIdWiseData(data2020_WithCompanyId: any) {
    // defined empty array for material name wise data 
    var dataCompanyIDWise: any = {}

    // property added material name wise
    companyId.map((item: any) => {
        dataCompanyIDWise[`${item}`]=[]
    });

    // setting data according to there respective material name
    var mapData_dataCompanyIDWise = Object.keys(dataCompanyIDWise)
    // for(let [index, data] of data2020_WithCompanyId.entries()){
    for(let data of data2020_WithCompanyId){
        mapData_dataCompanyIDWise.map((d) => {
            if(data.COMPANYID === d) {
                dataCompanyIDWise[`${d}`].push(data)
            }
        })
        delete data.COMPANYID
    }

    return dataCompanyIDWise
}

var dataCompanyIDWise2020 = companyIdWiseData(data2020_WithCompanyId)
var dataCompanyIDWise2021 = companyIdWiseData(data2021_WithCompanyId)

var companyIdArray2020 = Object.keys(dataCompanyIDWise2020)
var companyIdArray2021 = Object.keys(dataCompanyIDWise2021)

// Adding Recycled Data to Companies Object
companiesData.map((d: any,i: number) => {
    if(d.COMPANYID === companyIdArray2020[i]) d.recycled2020 = dataCompanyIDWise2020[companyIdArray2020[i]]
})
companiesData.map((d: any,i: number) => {
    if(d.COMPANYID === companyIdArray2021[i]) d.recycled2021 = dataCompanyIDWise2021[companyIdArray2021[i]]
})

// Adding Material Cost to Companies Data Object
for (const mdata of materialsData) {
    companiesData.map((d: any) => {
        d.recycled2020.map((d:any) => {
            if(d.MATERALID === mdata.MATERIALID) d.mCost = mdata.COST
        })
        d.recycled2021.map((d:any) => {
            if(d.MATERALID === mdata.MATERIALID) d.mCost = mdata.COST
        })
    })
}

// Created an array instance for Final Data Array 2020
var finalData2020: any = []
materialsData.map((d: any) => {
    finalData2020.push({[d.MATERIALNAME]:{ companyDetails: [/*{companyName: "", recycled: NaN, cost: NaN, profit: NaN}*/] } })
})

// Created an array instance for Final Data Array 2021
var finalData2021: any = []
materialsData.map((d:any) => {
    finalData2021.push({[d.MATERIALNAME]:{ companyDetails: [/*{companyName: "", recycled: NaN, cost: NaN, profit: NaN}*/] } })
})

// Created Final Data Array of Objects
for (const mdata of materialsData) {
    companiesData.map((cData:any) => {
        cData.recycled2020.map((rData:any, i: number) => {
            if(rData.MATERALID === mdata.MATERIALID){
                finalData2020[i][mdata.MATERIALNAME].companyDetails.push({companyName: cData.COMPANYNAME, recycled: rData.RECYCLED, cost: rData.mCost, profit: rData.RECYCLED * rData.mCost})
            }
        })
        cData.recycled2021.map((rData: any, i: number) => {
            if(rData.MATERALID === mdata.MATERIALID){
                finalData2021[i][mdata.MATERIALNAME].companyDetails.push({companyName: cData.COMPANYNAME, recycled: rData.RECYCLED, cost: rData.mCost, profit: rData.RECYCLED * rData.mCost})
            }
        })
    })
}

let comapnyNameArray = companiesData.map((c:any) => c.COMPANYNAME)

var finalData2020Values = Object.values(finalData2020)
var finalData2021Values = Object.values(finalData2021)

var finalFilteredData: any = [];
// Filter Data by Material and then Comapny name
function filterfinalDataByCompanyName(comapnyName: any, finalDataValues: any, finalData: any) {
    finalDataValues.map((data:any) => {
        finalFilteredData = [...finalFilteredData, {[Object.keys(data)[0]]: {companyDetails: []}}]
    })

    for (const [index, fData] of finalData.entries()) {
        let fDataKeys = Object.keys(fData)[0]
        let companyDetails = fData[fDataKeys].companyDetails
        companyDetails.map((cDetail:any) => {
            if (cDetail.companyName === comapnyName) {
                finalFilteredData[index][fDataKeys].companyDetails.push({companyName: cDetail.companyName, profit: cDetail.profit})
            }
        })
    }

    return finalFilteredData
}

let comapnyData: any = []
let comapnyProfits: any = []

// Collecting profit of all the companies material wise for the respective companies and for the respectve year
function companyProfitArray(comapnyNameArray: any, finalDataValues: any, finalData: any) {
    // clearing the comapnyData and comapnyProfits array if it was contained while function runs multiple times
    if(comapnyData.length > 0 || comapnyProfits.length > 0) {
        comapnyData.splice(0, comapnyData.length)
        comapnyProfits.splice(0, comapnyData.length)
    }
    comapnyData = filterfinalDataByCompanyName(comapnyNameArray, finalDataValues, finalData)
    comapnyProfits = comapnyData.map((d:any, i: number) => d[materialsData[i].MATERIALNAME].companyDetails[0].profit)
    return comapnyProfits
}

// setting default company name for companyProfit data
let companySelectValue = comapnyNameArray[0]

let companyProfit2020 = companyProfitArray(companySelectValue, finalData2020Values, finalData2020)
let companyProfit2021 = companyProfitArray(companySelectValue, finalData2021Values, finalData2021)

function App() {

  const [selectCompanyName, setSelectCompanyName] = useState(comapnyNameArray[0]);
    const [chartData, setChartData]: any = useState({
        labels: materialsData.map((d:any) => d.MATERIALNAME),
        datasets: [
            {
                label: '2020',
                data: companyProfit2020.map((d:any) => Math.round(d)),
                borderWidth: 1,
                borderColor: "rgba(0, 0, 0, 0.3)",
                backgroundColor: "rgba(0, 0, 0, 0.3)",
                fill: true
            },
            {
                label: '2021',
                data: companyProfit2021.map((d:any) => Math.round(d)),
                borderWidth: 1,
                borderColor: "rgba(0, 0, 255, 0.3)",
                backgroundColor: "rgba(0, 0, 255, 0.3)",
                fill: true
            },
        ]
    })

    function updateChart(e: SelectChangeEvent) {

        if(companyProfit2020.length > 0 || companyProfit2021.length > 0) {
            companyProfit2020.splice(0, companyProfit2020.length)
            companyProfit2021.splice(0, companyProfit2021.length)
        }
        setSelectCompanyName(e.target.value as any);
        companyProfit2020 = companyProfitArray(selectCompanyName, finalData2020Values, finalData2020)
        companyProfit2021 = companyProfitArray(selectCompanyName, finalData2021Values, finalData2021)
        setChartData((prevChartData:any) => {
            return {
                ...prevChartData,
                datasets: [
                    {
                        ...prevChartData.datasets[0],
                        data: companyProfit2020.map((d:any) => Math.round(d)),
                    },
                    {
                        ...prevChartData.datasets[1],
                        data: companyProfit2021.map((d:any) => Math.round(d)),
                    },
                ]
            }
        })
    }

  return (
    <>
      <ThemeProvider theme={theme}>
        <div className="chart-container">
          <FormControl fullWidth sx={{margin: "1rem 0 2rem 0",}}>
              <InputLabel id="demo-simple-select-label">Comapny Name</InputLabel>
              <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={selectCompanyName}
              label="CompanyName"
              onChange={(e) => updateChart(e)}
              >
              {comapnyNameArray.map((item:any, index: number) => (
                  <MenuItem key={index} value={item}>{item}</MenuItem>
              ))}
              </Select>
          </FormControl>
          <div className="profit-chart">
            <Barchart chartData={chartData} chartOptions={{scales:{y:{ beginAtZero: true }}}}/>
          </div>
        </div>
      </ThemeProvider>
    </>
  )
}

export default App
