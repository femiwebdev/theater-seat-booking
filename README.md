# theater-seat-booking
A front-end-only demo. Selected seats are not persisted. The code stores seat ids in data attributes and is ready for integration with a backend.

Theater Seat Booking - responsive demo

Files:
- `index.html` - demo page
- `styles.css` - responsive styles
- `script.js` - generates seat grid, selection and simple reserve/clear actions
 - `script.js` - generates seat grid, selection, pricing (VIP) and reserve/clear actions

How to open:
- Open `power_learn_project/html_css_js/theater-seat-booking/index.html` in a browser.
- The demo references the existing `seat guide.png` in the parent folder to help align the layout.

Notes:
- This is a front-end-only demo. Selected seats are not persisted. The code stores seat ids in data attributes and is ready for integration with a backend.
- The layout adapts columns and rows by window width to provide a larger grid on desktops/TVs and a single-column stacked layout on small devices.

New features:
- VIP seats (center-front area) are styled differently and have a higher price.
- Reserved seats are shown as 'Reserved' and cannot be selected.
- Each seat stores a price in `data-price`; the selection summary shows per-seat ids and a total price.

Try it:
- Click seats to toggle selection. VIP seats show higher pricing.
- Use Reserve to mark selected seats as reserved.
- Resize the browser to see responsive control layout (side panel on large screens, compact bottom bar on small screens).
