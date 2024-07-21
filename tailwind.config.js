/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.vue'],
  theme: {
    extend: {
      backgroundImage: {
        hero: "url('https://images.unsplash.com/photo-1567359781514-3b964e2b04d6?q=80&w=2068&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
        grain: "url('/grain.png')"
      },
      colors: {
        dark: '#141414'
      }
    }
  },
  plugins: []
}
