'use client';
import { useEffect, useState } from 'react';
import React from 'react';
import dynamic from 'next/dynamic';
// import { ApexOptions } from 'apexcharts';
import ChartTab from '../common/ChartTab';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function StatisticsChart() {
    const [totals, setTotals] = useState({ publications: 0, commentaires: 0 });
    const [roles, setRoles] = useState({ ETUDIANT: 0, PROFESSEUR: 0, DIPLOME: 0 });

    const [options, setOptions] = useState({});

    const [series, setSeries] = useState([]);
    const [labels, setLabels] = useState([]);
    useEffect(() => {
    fetch('http://localhost:3003/api/comments/stats/counts')
        .then(res => res.json())
        .then(setTotals);
    }, []);
    useEffect(() => {
        fetch('http://localhost:3001/admin/stats/roles')
          .then(res => res.json())
          .then(setRoles);
      }, []);
      useEffect(() => {
        fetch('http://localhost:3001/admin/stats/users-by-role')
          .then(res => res.json())
          .then(data => {
            const months = data.map(item => item.month);
            const etudiant = data.map(item => item.etudiant);
            const prof = data.map(item => item.professeur);
            const diplome = data.map(item => item.diplome);
      
            setLabels(months);
      
            setSeries([
              { name: 'Étudiants', data: etudiant },
              { name: 'Professeurs', data: prof },
              { name: 'Diplômés', data: diplome }
            ]);
      
            setOptions({
              chart: {
                type: 'area',
                height: 310,
                toolbar: { show: false },
                fontFamily: 'Outfit, sans-serif',
              },
              stroke: { curve: 'straight', width: [2, 2, 2] },
              fill: {
                type: 'gradient',
                gradient: { opacityFrom: 0.55, opacityTo: 0 },
              },
              colors: ['#465FFF', '#5FD068', '#FFB100'],
              markers: { size: 0, hover: { size: 6 } },
              dataLabels: { enabled: false },
              grid: {
                yaxis: { lines: { show: true } },
                xaxis: { lines: { show: false } },
              },
              xaxis: {
                categories: months,
                axisBorder: { show: false },
                axisTicks: { show: false },
              },
              yaxis: {
                labels: {
                  style: { fontSize: '12px', colors: ['#6B7280'] },
                },
              },
              tooltip: {
                x: { format: 'MMM' },
              },
              legend: { show: false },
            });
          });
      }, []);
      
      
  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 sm:px-6 sm:pt-6">
      <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
        <div className="w-full">
          <h3 className="text-lg font-semibold text-gray-800">Statistics</h3>
          <p className="mt-1 text-gray-500 text-sm">Target you’ve set for each month</p>
        </div>
        <div className="flex w-full sm:w-auto gap-3 sm:justify-end">
          <ChartTab />
        </div>
      </div>
      <div className="w-full overflow-hidden">
        <ReactApexChart options={options} series={series} type="area" height={310} />
        <div className="mt-6 bg-gray-100 p-4 rounded-xl flex items-center justify-between text-sm font-medium text-gray-700">
        {/* Publications */}
        <div className="text-center w-1/5">
            <div className="text-gray-500">Publications</div>
            <div className="text-lg font-bold text-gray-800">
            {totals.publications}
            <span className="ml-1 text-green-500">↑</span>
            </div>
        </div>
        {/* Separator */}
        <div className="h-10 w-px bg-gray-300" />
        {/* Commentaires */}
        <div className="text-center w-1/5">
            <div className="text-gray-500">Commentaires</div>
            <div className="text-lg font-bold text-gray-800">
            {totals.commentaires}
            <span className="ml-1 text-green-500">↑</span>
            </div>
        </div>
        {/* Separator */}
        <div className="h-10 w-px bg-gray-300" />
        {/* Rôles */}
        <div className="flex justify-between w-2/5 text-center">
            <div className="w-1/3">
            <div className="text-gray-500">Étudiants</div>
            <div className="text-lg font-bold text-gray-800">
                {roles.ETUDIANT}
                <span className="ml-1 text-green-500">↑</span>
            </div>
            </div>
            <div className="border-l border-gray-300" />
            <div className="w-1/3">
            <div className="text-gray-500">Professeurs</div>
            <div className="text-lg font-bold text-gray-800">
                {roles.PROFESSEUR}
                <span className="ml-1 text-green-500">↑</span>
            </div>
            </div>
            <div className="border-l border-gray-300" />
            <div className="w-1/3">
            <div className="text-gray-500">Diplômés</div>
            <div className="text-lg font-bold text-gray-800">
                {roles.DIPLOME}
                <span className="ml-1 text-green-500">↑</span>
            </div>
            </div>
        </div>
        </div>
      </div>
    </div>
  );
}