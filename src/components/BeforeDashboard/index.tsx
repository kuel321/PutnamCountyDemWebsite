import { Button } from '@payloadcms/ui'
import React from 'react'

const BeforeDashboard: React.FC = () => {
  return (
    <div className="before-dashboard">
      <Button el="anchor" url="/admin/collections/media/create" buttonStyle="primary" icon="plus">
        Upload a Photo or File
      </Button>
    </div>
  )
}

export default BeforeDashboard
