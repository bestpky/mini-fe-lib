import createElement from './create-element'
import { workLoop } from './scheduler'
import { useState } from './use-state'
import { Component, transfer } from './component'

// 开启无限循环
requestIdleCallback(workLoop)

export { createElement, useState, Component, transfer }
