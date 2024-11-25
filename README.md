# Write and Run

Write and Run is a platform designed to streamline the process of practicing handwritten code by transforming it into executable programs. It eliminates inefficiencies in testing and debugging, enabling students to prepare more effectively for coding exams.

This project was created in a 36 hour timespan and submitted as a part of the McGill CodeJam Hackathon, winning the "Best use of AI" award. The platform is hosted at [write-and-run.vercel.app](https://write-and-run.vercel.app/) and the Devpost submission can be found [here](https://devpost.com/software/write-and-run).

## Project Structure

- **Frontend**  
  - Built with [Vite](https://vitejs.dev/), [React](https://reactjs.org/), and [Tailwind CSS](https://tailwindcss.com/), using [TypeScript (TSX)](https://www.typescriptlang.org/) for dynamic and type-safe components.
  - Focused on delivering a smooth and intuitive user interface.

- **Backend**  
  - Developed with [Flask](https://flask.palletsprojects.com/) for API logic.
  - Utilizes [Supabase](https://supabase.com/) for user data and test results.
  - Incorporates the OpenAI API for optical character recognition (OCR) and code analysis.

- **Containerization and Hosting**  
  - Docker ensures consistent builds and deployments.
  - Frontend is hosted on [Vercel](https://vercel.com/), and backend is hosted on [Google Cloud](https://cloud.google.com/).

- **Languages Supported**  
  - Java, C, Bash, and Python.

Write and Run simplifies the journey from handwritten code to execution, helping students master coding under exam conditions.

## How to Run

### Frontend
The frontend is built using Vite, React, and Tailwind CSS. To start the development server:

```bash
cd frontend
npm install
npm run dev
```

### API
The backend API is powered by Flask and requires an OpenAI API key for code analysis and OCR. To set up and run the backend:

```bash
export OPENAI_API_KEY="your_openai_api_key"
cd api
pip install -r requirements.txt
python3 app.py
```
