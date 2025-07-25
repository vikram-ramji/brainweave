import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'

export default function AuthCard({ title, description, children }: { title: string, description?: string, children: React.ReactNode }) {
  return (
    <Card className="w-full max-w-md p-2 rounded-lg border-0 bg-background">
        <CardHeader>
            <CardTitle className="text-2xl font-bold text-center dark:text-slate-100">{title}</CardTitle>
            {description && <CardDescription className="text-md text-center text-slate-600 dark:text-slate-400">{description}</CardDescription>}
        </CardHeader>
        <CardContent>
            {children}
        </CardContent>
    </Card>
  )
}
