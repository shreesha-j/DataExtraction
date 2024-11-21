"use client";
import React from 'react'
import { FileUpload } from './FileUpload'
import { CSVUpload } from './csvUpload'
import { ProcessData } from './OutputExtraction'

type Props = {}

/**
 * PageWrapper component serves as a layout wrapper for file and CSV uploads,
 * as well as data processing. It includes the FileUpload and CSVUpload components
 * for handling file inputs, and the ProcessData component for processing the uploaded data.
 * 
 * @param {Props} props - The props that will be passed to the PageWrapper component.
 */
const PageWrapper = (props: Props) => {
  return (
    <div>
      <div className="flex">
        <FileUpload />
        <CSVUpload />
      </div>
      <ProcessData />
    </div>
  )
}

export default PageWrapper