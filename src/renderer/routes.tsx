/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import React from 'react'
import { Navigate, Route, Routes as RouterRoutes } from 'react-router-dom'
import Synchronize from './pages/synchronize/synchronize'
import Compilation from './pages/compilation/compilation'
import Groups from './pages/groups/groups'
import Settings from './pages/settings/settings'

function Routes() {
  return (
    <div className="flex w-full flex-col">
      <RouterRoutes>
        <Route element={<Synchronize />} path="/synchronize" />
        <Route element={<Compilation />} path="/compilation" />
        <Route element={<Groups />} path="/groups" />
        <Route element={<Settings />} path="/settings" />
        <Route element={<Navigate replace to="/synchronize" />} path="*" />
      </RouterRoutes>
    </div>
  )
}

export default Routes
