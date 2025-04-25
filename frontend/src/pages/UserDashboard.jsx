import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar/Sidebar'
import Dashboard from './Dashboard/Dashboard'
import AssetsPage from './AssetsPage/AssetsPage'
import ComparisonPage from './ComparisonPage/ComparisonPage'
import Navbar from '../components/Navbar/Navbar'

const UserDashboard = () => {
  return (
    <div className="app-layout">

      <Navbar/>
      <Sidebar/>
      <main className="main-content">
        <Routes>
          <Route index element={<Dashboard />} />
          <Route path="assets" element={<AssetsPage />} />
          <Route path="comparison" element={<ComparisonPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default UserDashboard
