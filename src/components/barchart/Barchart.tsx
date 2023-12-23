// import axios from "axios";
import { Bar } from "react-chartjs-2";
import {Chart as CharJS} from 'chart.js/auto'
import {LineController, LineElement, PointElement, LinearScale, Title,CategoryScale} from 'chart.js'
CharJS.register(LineController, LineElement, PointElement, LinearScale, Title, CategoryScale)

export function Barchart({chartData, chartOptions}: any) {
    return <Bar data={chartData} options={chartOptions} />
}