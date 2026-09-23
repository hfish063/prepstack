# PrepStack

## About

Many computer science students face significant hurdles entering the job market because academic coursework rarely replicates the high-pressure, nuanced environment of technical interviews. This application aims to bridge that gap by providing a full-fledged, real-time interview simulation that evaluates both programmatic problem-solving and critical communication skills, moving far beyond the scope of a standard "chatbot".

## Development

### Setup

The project is structured within a mono-repository, meaning both the frontend and backend portions of the application exist in the same project space.

In order to successfully launch the web app we must first complete some prerequisite steps.

1. `docker run --name prepstack -e POSTGRES_PASSWORD=password -p`
2. Setup an account for [Clerk](https://clerk.com), this service provides user management and authentication.
3. Create a project in the Clerk dashboard, and obtain a secret API key.
4. Add this key to your `.env` (Note: you might have to create a `.env` file yourself) in the `backend` directory.
5. Now setup the Clerk SDK for your frontend, follow [this](https://clerk.com/docs/nextjs/getting-started/quickstart) guide
6. It's time to install our backend dependencies. Run the following command from the `backend` folder.
   `python3 -m pip install -r requirements.txt`

### Running the Application

1. Ensure your database is up and running on port 5432 (or whichever port it was configured with).
2. Launch the frontend with `npm run dev`
3. Launch the backend with `fastapi dev`
