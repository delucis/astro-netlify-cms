import identity from 'netlify-identity-widget';

identity.on('init', (user) => {
  if (!user) {
    identity.on('login', () => {
      document.location.href = '/admin/';
    });
  }
});

identity.init();
