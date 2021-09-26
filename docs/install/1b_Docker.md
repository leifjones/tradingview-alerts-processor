# Installation using AWS lightsail - Docker

### 📦️ Instance setup

- Create a [AWS lightsail](https://lightsail.aws.amazon.com/) account

- Deploy an VPS instance
  - Go to [AWS lightsail > Intances](https://lightsail.aws.amazon.com/ls/webapp/home/instances)
  - Select [Create instance](https://lightsail.aws.amazon.com/ls/webapp/create/instance)
  - Select the closest region to your exchange : _ap-northeast-1_ for Binance and FTX
  - Select Linux/Unix > OS > __Ubuntu (latest version)__
  - Name it like you want
  - Validate creation

- Add a static IP
  - Go to [AWS lightsail > Networking](https://lightsail.aws.amazon.com/ls/webapp/home/networking)
  - Select [Create static IP](https://lightsail.aws.amazon.com/ls/webapp/create/static-ip)
  - Attach it to your instance (if you're not seeing it wait few minutes)
  - Name it like you want
  - Validate creation

### 🔒️ SSH access (optional)

>
> If you're not confident with SSH you can open a Terminal using your browser on AWS lightsail by clicking on your instance and skip this step
>

- Create SSH key pairs
  - Go to [AWS lightsail > SSH keys](https://lightsail.aws.amazon.com/ls/webapp/account/keys)
  - Select default key
  - Download the `.pem` file (let's pretend that you saved it here `~/Downloads/key.pem`)

- Test your access
  - Open a local terminal session
  - Adjust your key rights with this :

    ```sh
    chmod 400 ~/Downloads/key.pem
    ```

- SSH to your instance using the downloaded key like this (you can find the
    username/ip by selecting your instance [here](https://lightsail.aws.amazon.com/ls/webapp/home/instances)) :

    ```sh
    ssh USERNAME@YOUR.STATIC.IP.ADDRESS -i ~/Downloads/key.pem
    ```

### 🚀 Install and configure app

- Open a terminal session with your instance
- Install dependencies and run the app :

    ```sh
    curl https://raw.githubusercontent.com/thibaultyou/tradingview-alerts-processor/master/install.docker.sh --output install.docker.sh
    sudo sh install.docker.sh
    ```

- Once done you can check from your browser that everything is running fine on _http://YOUR.STATIC.IP.ADDRESS/health_

### 💄 Optional steps

>
> For those steps you need to be logged in your instance, see the first command in [🚀 Install and configure app](#%F0%9F%9A%80-install-and-configure-app)
>

- Check services logs (production logs) :

    ```sh
    sudo docker-compose logs -f --tail='10'
    ```

- Check all app logs (debug logs) :

    ```sh
    tail -f docker/logs/debug.log
    ```

- Update the app :
  - Create a snapshot of your current working instance, so you have a back-up in case the update goes wrong:
    - Go to [AWS lightsail > Instances](https://lightsail.aws.amazon.com/ls/webapp/home/instances)
    - Open the instance you want to back-up
    - Open the Snapshots tab
    - Create snapshot
    - Give your snapshot a name (hint: add a date and/or time to the snapshot name)
    - Click Create
  - Run the following command:

    ```sh
    sudo docker-compose pull && sudo docker-compose up -d
    ```

- Restrict commands to Tradingview alerts system only, __once activated you'll not be able to send commands from your computer with HTTP requests, please [add your accounts](./1c_Keys.md) before using this__ :
  - Go to AWS lightsail > your instance > Networking
  - Add a filter rule on TCP port 80
  - Check restrict to IP
  - Add the following :
    - 52.89.214.238
    - 34.212.75.30
    - 54.218.53.128
    - 52.32.178.7