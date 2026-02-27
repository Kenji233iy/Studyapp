export const metadata = {
  title: 'StudyFlow API',
  description: 'AI-powered study assistant backend',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
