<template>
  <div>
    <header>
      <h1>这是示例布局</h1>
      <ul>
        <li><router-link to="/">首页</router-link></li>
        <li><router-link to="/about">关于我们</router-link></li>
        <li><router-link to="/user">用户中心</router-link></li>
      </ul>
    </header>
    <main>
      <RouterView />
    </main>
  </div>
</template>

