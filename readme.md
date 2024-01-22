# Personalization Dashboard Setup Guide

This guide provides step-by-step instructions on how to set up the Personalization Dashboard project. Please follow these instructions carefully to ensure a smooth setup process.

## Prerequisites

- Git should be setup in your local machine
   #### Checking if Git is Installed
   
   Open the terminal in your Operating System and type the command below.
   
    ```shell
         git --version
   ```
   
   ##### To open the Terminal:

   ###### For Windows:

   Open the Command Prompt by pressing `Win + R` and typing `cmd`, type the command above, then press Enter.


   ###### macOS:

   Open the Terminal by going to `Applications > Utilities > Terminal`, paste the above command and hit Enter.


   ###### Linux:
   
   Open the terminal by pressing `Ctrl + Alt + T` and paste the command and press Enter.

   If Git is installed, the command will display the version number of Git. If you see the version number, it means Git is already installed on your machine.

   If Git is not installed, you will see an error message indicating that the command is not recognized. In this case, [proceed to the installation instructions below.](#installing-git)

- Make sure you have yarn installed, [the steps to install yarn are given below.](#installing-yarn).
   #### Checking if Yarn is Installed
   Type the command below in your terminal and see the output.
   ```shell
      yarn --version
   ```
   If Yarn is installed, the command will display the version number of Yarn. If you see the version number, it means Yarn is already installed on your machine.

   If Yarn is not installed, you will see an error message indicating that the command is not recognized. In this case, [proceed to the installation instructions below.](#installing-yarn)


- Node should be installed.
   #### Checking if Node is Installed
   Type the command below in your terminal and see the output.
   ```shell
      node --version
   ```
   If Node.js is installed, the command will display the version number of Node.js. If you see the version number, it means Node.js is already installed on your machine.

   If Node.js is not installed, you will see an error message indicating that the command is not recognized. In this case, [proceed to the installation instructions below.](#installing-nodejs-and-npm)
   
   Make sure that the version of node installed is latest or greater than v18.


- [Skip the steps](#clone-the-project) below if you have setup the pre-requisites.






## Installing Git

To install Git, follow these steps:

1. Open a web browser and visit the official Git website at [https://git-scm.com/](https://git-scm.com/).

2. Download the Git installer suitable for your operating system (Windows, macOS, or Linux) by clicking on the provided link.

3. Once the download is complete, locate the installer file and run it.

4. Follow the instructions provided by the installer to complete the installation. Accept the license agreement, choose the installation directory if prompted, and select the appropriate options based on your preferences.

5. After the installation is complete, open a new terminal or command prompt and repeat the command:
   ```
   git --version
   ```

6. This time, the command should display the version number of Git. If you see the version number, it means Git has been successfully installed on your machine.

By following these steps, you should be able to check if Git is installed on your machine and install it if necessary. Git is an essential tool for version control and collaboration, and it will be useful for managing code repositories and working with the User Authentication project.

## Installing Yarn

To install Yarn, follow these steps:

#### Windows:

1. Open a web browser and visit the official Yarn website at [https://classic.yarnpkg.com/en/docs/install/#windows-stable](https://classic.yarnpkg.com/en/docs/install/#windows-stable).

2. Download the Yarn installer suitable for Windows by clicking on the provided link.

3. Once the download is complete, locate the installer file and run it.

4. Follow the instructions provided by the installer to complete the installation. Accept the license agreement, choose the installation directory if prompted, and select the appropriate options based on your preferences.

5. After the installation is complete, open a new Command Prompt and repeat the command:
   ```
   yarn --version
   ```

6. This time, the command should display the version number of Yarn. If you see the version number, it means Yarn has been successfully installed on your machine.

#### macOS:

1. Open a terminal.

2. In the terminal, type the following command and press **Enter** to install Yarn using Homebrew:
   ```
   brew install yarn
   ```

3. After the installation is complete, repeat the command:
   ```
   yarn --version
   ```

4. This time, the command should display the version number of Yarn. If you see the version number, it means Yarn has been successfully installed on your machine.

#### Linux:

1. Open a terminal.

2. In the terminal, type the following command and press **Enter** to add the Yarn repository:
   ```
   curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
   ```

3. Next, add the Yarn

 repository to your system:
   ```
   echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
   ```

4. Update the package list:
   ```
   sudo apt-get update
   ```

5. Install Yarn:
   ```
   sudo apt-get install yarn
   ```

6. After the installation is complete, repeat the command:
   ```
   yarn --version
   ```

7. This time, the command should display the version number of Yarn. If you see the version number, it means Yarn has been successfully installed on your machine.

By following these steps, you should be able to check if Yarn is installed on your machine and install it if necessary. Yarn is a package manager that can be used as an alternative to npm, and it will be useful for managing dependencies in the User Authentication project.

## Installing Node.js and npm

To install Node.js and npm, follow these steps:

#### Windows:

1. Open a web browser and visit the official Node.js website at [https://nodejs.org/](https://nodejs.org/).

2. On the Node.js website homepage, you will see two download options: LTS (Long-Term Support) and Current. It is recommended to choose the LTS version for stability unless you have a specific reason to use the Current version. Click on the "Download" button for the LTS version.

3. Once the download is complete, locate the installer file and run it.

4. The installer will guide you through the installation process. Accept the license agreement and choose the installation directory if prompted.

5. On the "Select Components" screen, make sure that the "Node.js runtime" and "npm package manager" options are selected. You can also choose to include additional tools and features if desired.

6. Proceed with the installation by clicking the "Next" or "Install" button.

7. The installer will now copy the necessary files and configure Node.js and npm on your machine.

8. Once the installation is complete, open a new Command Prompt and repeat the command:
   ```
   node --version
   ```

9. This time, the command should display the version number of Node.js. If you see the version number, it means Node.js has been successfully installed on your machine.

10. To verify that npm is installed, repeat the command:
    ```
    npm --version
    ```

11. This should display the version number of npm. If you see the version number, it means npm has been successfully installed on your machine.

#### macOS:

1. Open a web browser and visit the official Node.js website at [https://nodejs.org/](https://nodejs.org/).

2. On the Node.js website homepage, you will see two download options: LTS (Long-Term Support) and Current. It is recommended to choose the LTS version for stability unless you have a specific reason to use the Current version. Click on the "Download" button for the LTS version.

3. Once the download is complete, locate the installer file and double-click it to run it.

4. The installer will guide you through the installation process. Accept the license agreement and choose the installation directory if prompted.

5. On the "Select Components" screen, make sure that the "Node.js runtime" and "npm package manager" options are selected. You can also choose to include additional tools and features if desired.

6. Proceed with the installation by clicking the "Next" or "Install" button.

7. The installer will now copy the necessary files and configure Node.js and npm on your machine.

8. Once the installation is complete, open a new Terminal and repeat the command:
   ```
   node --version
   ```

9. This time, the command should display the version number of Node.js. If you see the version number, it means Node.js has been successfully installed on your machine.

10. To verify that npm is installed, repeat the command:
    ```
    npm --version
    ```

11. This should display the version number of npm. If you see the version number, it means npm has been successfully installed on your machine.

#### Linux:

1. Open a terminal.

2. Use the package manager for your Linux distribution to install Node.js and npm. For example, on Ubuntu or Debian, you can use the following command:
   ```
   sudo apt-get install nodejs npm
   ```

   This command will install Node.js and npm from the official package repositories.

3. After the installation is complete, repeat the command:
   ```
   node --version
   ```

4. This time, the command should display the version number of Node.js. If you see the version number, it means Node.js has been successfully installed on your machine.

5. To verify that npm is installed, repeat the command:
   ```
   npm --version
   ```

6. This should display the version number of npm. If you see the version number, it means npm has been successfully installed on your machine.

By following these steps, you should be able to check if Node.js is installed on your machine and install it if necessary.


## Clone the Project

1. Open a terminal or command prompt.
2. Run the following command in the terminal inside the directory where you wan to save the project and clone the project to your local environment by running the command below:

   ```shell
   git clone https://github.com/attrybtech/personalization-dashboard
   ```

3. Change into the project directory:

   ```shell
   cd personalization-dashboard
   ```
## Setting Up Environment Variables

1. Ask the repository maintainer for the corresponding `.env` file:
2. Open the `.env` file in the root directory of the project.
3. Paste the copied contents into the `.env` file, replacing the existing contents.



## Running the Project

1. Make sure you are in the root directory of the project.
2. Run the following command to start the development server:

   ```shell
   yarn run start:dev
   ```

   If this command does not start the server, open the `package.json` file and check the `"scripts"` section. The `"start:dev"` command should be responsible for starting the project.

   It should look like this:

   ```json
   "scripts": {
     "start:dev": "set VITE_DEV_PORT=5174 && vite --port 5174",
     "start:prod": "tsc && vite build",
     "preview": "vite preview"
   }
   ```

   If necessary, modify the `"start:dev"` command to match the above format.

3. The project will now be accessible at [http://localhost:5174/](http://localhost:5174/) in your web browser.

## Additional Notes
### Switch to the Dev Branch while getting started

1. Ensure that you are on the `dev` branch while opening the project. You can check the branch you're currently working on as: 
```shell
   git branch --show-current
```
 If not, switch to it by running the following command:

   ```shell
   git checkout dev
   ```

### Create and Checkout to a New Branch

1. Create a new branch for your work. Choose a meaningful branch name that describes the feature or task you will be working on.

   ```shell
   git checkout -b <branch-name>
   ```

   Replace `<branch-name>` with the desired branch name.
- Make sure that you're logged in and authorized github user with your Attryb Github Credentials 
- Always make sure to take a pull from the `dev` branch before starting work.
- Before raising a pull request, build the project using the following command:

  ```shell
  yarn run start:prod
  ```

  If the build completes without errors, you're ready to proceed. If there are any errors, resolve them before proceeding.
- When running the project for the first time, ensure that the following three projects are running independently at the same time:
  - Personalization Dashboard
  - User Authentication
  - User Activity Backend

## Notes on Branching

- Avoid making changes directly to the `main` and `dev` branch. Always create a new branch for your work.
- After committing changes in your branch, push the changes and raise a pull request to the `dev` branch before starting on a new task.

## Troubleshooting

If you encounter the following error while switching GitHub accounts and are unable to push or make a commit to a remote repository:

```shell
$ git push -u origin master
remote: Permission to <user-name>/test.git denied to <another-user-name>.
fatal: unable to access 'https://github.com/<user-name>/test.git/': The requested URL returned error: 403
```

This error occurs when the current GitHub account does not have the necessary permissions to access the repository. To resolve this issue, follow these steps:

1. You have to remove your saved Git credentials

2. Go to the teminal and setup your new username and email associated with the authorized Github account.

3. ```shell
         git config --global --edit
    ```
4. It will open the text editor, to get into the insert mode, press `i` and head towards the `email` and `name` in the `[user]` section, setup your username in the `name` and your email in the`email` section and in the `[credential]` section comment out the helper line as `#helper = manager`. This will unset the credentials.

5. Get out of text editor by pressing `Esc` and saving the editor with the command `!wq` and press Enter.

6. Next time when you'll try to make the commit/push, it will take you to the Github page where you can authorize it from your correct GitHub Account.

If you continue to experience issues with accessing or pushing to the remote repository, ensure that the account you are using has the necessary permissions granted by the repository owner.

---

By following these instructions, you should be able to set up the Personalization Dashboard project and start working on it successfully. If you encounter any issues, please refer to the troubleshooting documentation or seek assistance from the project team.