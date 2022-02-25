const e = () => {
    const e = document.querySelector('.alert');
    e && e.parentElement.removeChild(e);
  },
  t = (t, s) => {
    e();
    const a = `<div class="alert alert--${t}">${s}</div>`;
    document.querySelector('body').insertAdjacentHTML('afterbegin', a),
      window.setTimeout(e, 5e3);
  },
  s = async (e, s) => {
    try {
      ((
        await axios({
          method: 'post',
          url: '/api/v1/users/signin',
          data: { email: e, password: s },
        })
      ).data.status = 'success'),
        t('success', 'logged in successfully!'),
        window.setTimeout(() => {
          location.assign('/');
        }, 1500);
    } catch (e) {
      t('error', e.response.data.message);
    }
  },
  a = async (e, s) => {
    try {
      const a =
        'password' === s
          ? '/api/v1/users/updatepassword'
          : '/api/v1/users/updateme';
      ((await axios({ method: 'patch', url: a, data: e })).data.status =
        'success'),
        t('success', `user ${s} updated successfully`);
    } catch (e) {
      t('error', e.response.data.message);
    }
  },
  o = Stripe(
    'pk_test_51KQpuTKrlXNuJzMcYQn015K2UlTnesCu0KnHXGEwbG52vHrjHOgKV5HlKzukUhRwPbaK846qTRlnkj5igvxt84Kd00RMfao0h2'
  ),
  n = document.getElementById('map'),
  d = document.querySelector('.form--login'),
  r = document.querySelector('.form--signup'),
  c = document.querySelector('.nav__el--logout'),
  u = document.querySelector('.form-user-data'),
  l = document.querySelector('.form-user-password'),
  m = document.getElementById('book-tour');
if (n) {
  ((e) => {
    mapboxgl.accessToken =
      'pk.eyJ1IjoiYmlzaGFsa2Fya2kiLCJhIjoiY2t6NG4wbHlmMGk5bDJ2bnltYzR1ZW54NCJ9.3hBPs8q_dHXFJ0lK6ln7SA';
    const t = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        scrollZoom: !1,
      }),
      s = new mapboxgl.LngLatBounds();
    e.forEach((e) => {
      const a = document.createElement('div');
      (a.className = 'marker'),
        new mapboxgl.Marker({ element: a, anchor: 'bottom' })
          .setLngLat(e.coordinates)
          .addTo(t),
        new mapboxgl.Popup({ offset: 30 })
          .setLngLat(e.coordinates)
          .setHTML(`<p>Day ${e.day}: ${e.description}</p>`)
          .addTo(t),
        s.extend(e.coordinates);
    }),
      t.fitBounds(s);
  })(JSON.parse(n.dataset.locations));
}
d &&
  d.addEventListener('submit', (e) => {
    e.preventDefault();
    const t = document.getElementById('email').value,
      a = document.getElementById('password').value;
    s(t, a);
  }),
  r &&
    r.addEventListener('submit', (e) => {
      e.preventDefault();
      const t = document.getElementById('email').value,
        a = document.getElementById('password').value,
        o =
          (document.getElementById('passwordCon').value,
          document.getElementById('name').value);
      console.log(o, t, a, passwordConfirm), s(o, t);
    }),
  c &&
    c.addEventListener('click', (e) => {
      e.preventDefault(),
        (async () => {
          try {
            'success' ===
              (await axios({ method: 'GET', url: '/api/v1/users/logout' })).data
                .status &&
              window.setTimeout(() => {
                location.assign('/');
              }, 1e3);
          } catch (e) {
            t('error', e.response.data.message);
          }
        })();
    }),
  u &&
    u.addEventListener('submit', (e) => {
      e.preventDefault();
      const t = new FormData();
      t.append('email', document.getElementById('email').value),
        t.append('name', document.getElementById('name').value),
        t.append('photo', document.getElementById('photo').files[0]),
        a(t, 'data');
    }),
  l &&
    l.addEventListener('submit', (e) => {
      e.preventDefault();
      const t = document.getElementById('password-current').value,
        s = document.getElementById('password').value,
        o = document.getElementById('password-confirm').value;
      a({ passwordCurrent: t, password: s, passwordConfirm: o }, 'password');
    }),
  m &&
    m.addEventListener('click', (e) => {
      e.preventDefault(), (m.innerHTML = 'Processing...');
      const { tourId: s } = e.target.dataset;
      console.log(s),
        (async (e) => {
          try {
            const t = await axios(`/api/v1/bookings/checkout-session/${e}`);
            t && (await o.redirectToCheckout({ sessionId: t.data.session.id }));
          } catch (e) {
            t('error', e);
          }
        })(s);
    });
//# sourceMappingURL=index.js.map
