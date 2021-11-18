<template>
  <nav id="side-bar">
    <section class="side-nav">
      <nav class="uppermenu">
        <div class="logo">
          <img src="/img/assets/logo-white.svg" style="width: 75%" />
        </div>
        <div class="menu">
          <a href="#"
            ><div class="d">
              <img src="/img/assets/1.png" />
              <p>Dashboard</p>
            </div></a
          >
          <a href="#"
            ><div class="d">
              <img src="/img/assets/2.png" />
              <p>Insights</p>
            </div></a
          >
          <a href="#"
            ><div class="d">
              <img src="/img/assets/3.png" />
              <p>Transactions</p>
            </div></a
          >
          <a href="#"
            ><div class="d">
              <img src="/img/assets/5.png" />
              <p>Settings</p>
            </div></a
          >

          <!-- <a href="#"
            ><div class="d">
              <img src="/img/assets/4.png" />
              <p>Accounts</p>
            </div></a
          >
          <hr />
          <a href="#"
            ><div class="d">
              <img src="/img/assets/6.png" />
              <p>Invite Friends</p>
            </div></a
          > -->
        </div>
      </nav>
      <nav class="lowermenu">
        <a href="#" @click.prevent="logoutUser"
          ><div class="d">
            <img src="/img/assets/7.png" />
            <p>Logout</p>
          </div></a
        >
        <hr />
        <footer>
          <a href="#">Terms</a>
          <a href="#">Privacy</a>
          <a href="#">Support</a>
        </footer>
      </nav>
    </section>

    <nav class="bottom-nav">
      <div class="dbot">
        <img src="/img/assets/n1.png" />
        <p>Dashboard</p>
      </div>
      <div class="dbot">
        <img src="/img/assets/n2.png" />
        <p>Insights</p>
      </div>
      <div class="dbot">
        <img src="/img/assets/n3.png" />
        <p>Transactions</p>
      </div>
      <div class="dbot">
        <img src="/img/assets/n5.png" />
        <p>Settings</p>
      </div>

      <!-- <div class="dbot">
        <img src="/img/assets/n4.png" />
        <p>Accounts</p>
      </div>-->
    </nav>
  </nav>
</template>
