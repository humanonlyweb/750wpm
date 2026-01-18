<script setup lang="ts"></script>

<template>
  <div :class="$style.layoutWrap">
    <a href="#main-content" :class="$style.skipLink">Skip to content</a>
    <AppHeader />
    <main id="main-content">
      <slot />
    </main>
    <footer :class="$style.footer">
      <p :class="$style.privacyNote">
        All articles and reading data are stored locally in your browser. We don't collect or
        process any user information on our servers.
      </p>
      <NuxtLink to="https://github.com/humanonlyweb/750wpm" external target="_blank">
        Check out the code on GitHub.
      </NuxtLink>
    </footer>
  </div>
</template>

<style lang="scss" module>
.layoutWrap {
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding: 16px;

  @media (min-width: 480px) {
    padding: 20px;
  }
}

.skipLink {
  position: absolute;
  top: -100%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  padding: 12px 24px;
  background-color: var(--accent);
  color: var(--text);
  font-weight: 500;
  font-size: 14px;
  border-radius: var(--radius-sm);
  text-decoration: none;
  transition: top 0.15s ease;

  &:focus {
    top: 12px;
    outline: 2px solid var(--text);
    outline-offset: 2px;
  }
}

.footer {
  margin-top: auto;
  padding-top: 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  text-align: center;

  a {
    font-size: 12px;
    color: var(--text-muted);
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
}

.privacyNote {
  font-size: 11px;
  line-height: 1.5;
  color: var(--text-muted);
  max-width: 400px;
  opacity: 0.7;
}
</style>
