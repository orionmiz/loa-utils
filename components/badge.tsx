import React from "react";
import clsx from 'clsx'

export default function Badge({
  label,
  color = 'bg-gray-500'
}: {
  label: string,
  color: string
}) {

  //let styles = `rounded text-gray-50 px-1 mx-1 bg-gray-500`;

  return (
    <span className={`rounded text-gray-50 ${color} px-1`}>
      {label}
    </span>
  )
}