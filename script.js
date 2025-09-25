// Simple seat grid generator and interaction
(function(){
  const seating = document.getElementById('seating');
  const selectedCount = document.getElementById('selectedCount');
  const selectedList = document.getElementById('selectedList');
  const clearBtn = document.getElementById('clearBtn');
  const reserveBtn = document.getElementById('reserveBtn');
  const compactReserve = document.getElementById('compactReserve');

  // Configuration: rows and columns adapt based on CSS grid breakpoints
  // We'll create a flexible layout that tries to match the attached guide visually: 3 blocks wide with aisles
  function getLayout() {
    const w = window.innerWidth;
    if (w >= 1600) return {cols:24, rows:12, blocks:[{c:6},{c:12},{c:6}]};
    if (w >= 1100) return {cols:18, rows:12, blocks:[{c:4},{c:10},{c:4}]};
    if (w >= 700) return {cols:12, rows:11, blocks:[{c:3},{c:6},{c:3}]};
    return {cols:10, rows:10, blocks:[{c:2},{c:6},{c:2}]};
  }

  let reservedSet = new Set();
  let selectedSet = new Set();

  // Pricing
  const basePrice = 8; // default
  const vipPrice = 18;

  // helper to id seats like A1,B3 etc
  function seatId(r,c){
    const rowChar = String.fromCharCode(65 + r);
    return rowChar + (c+1);
  }

  function render() {
    const layout = getLayout();
    seating.innerHTML='';
    seating.style.gridTemplateColumns = `repeat(${layout.cols}, 1fr)`;

    // We'll create rows x cols, but insert empty gaps to form aisles between blocks
    for(let r=0;r<layout.rows;r++){
      // create a left margin row spacer to visually separate front rows
      for(let c=0, colIndex=0;c<layout.cols;c++){
        // determine whether this column is part of an aisle gap by consulting blocks
        // compute cumulative columns to find block boundaries
        let cum=0;let inBlock=false;
        for(let b of layout.blocks){
          cum += b.c;
          if (c < cum) { inBlock=true; break }
          // gap between blocks: next column should be an empty spacer
        }
        // We'll treat columns that are not inBlock as spacer
        if(!inBlock){
          const spacer = document.createElement('div');
          spacer.className='row-gap';
          spacer.setAttribute('aria-hidden','true');
          seating.appendChild(spacer);
          continue;
        }

        const s = document.createElement('button');
        s.className='seat available';
        s.type='button';
        s.dataset.row = r;
        s.dataset.col = c;
        const id = seatId(r, c);
        s.dataset.sid = id;
        s.title = id;
        // determine VIP zones: center block is VIP
        const layoutCols = layout.cols;
        const vipStart = Math.floor(layoutCols*0.33);
        const vipEnd = Math.ceil(layoutCols*0.66);
        if(c >= vipStart && c < vipEnd && r < Math.max(3, Math.floor(layout.rows*0.25))){
          s.classList.add('vip');
          s.dataset.price = vipPrice;
        } else {
          s.dataset.price = basePrice;
        }
        // some random reserved for demo
        if(Math.random() < 0.12) { s.className='seat reserved'; reservedSet.add(id) }
  s.addEventListener('click', onSeatClick);
  s.addEventListener('keydown', function(ev){ if(ev.key==='Enter' || ev.key===' ') { ev.preventDefault(); onSeatClick(ev) } });
        seating.appendChild(s);
      }
    }
    refreshSelectionUI();
  }

  function onSeatClick(e){
    const btn = e.currentTarget;
    const id = btn.dataset.sid;
  if(btn.classList.contains('reserved')) return;
    if(btn.classList.contains('selected')){
      btn.classList.remove('selected');
      btn.classList.add('available');
      selectedSet.delete(id);
    } else {
      btn.classList.remove('available');
      btn.classList.add('selected');
      selectedSet.add(id);
    }
  refreshSelectionUI();
  }

  function refreshSelectionUI(){
    selectedCount.textContent = selectedSet.size;
    const list = Array.from(selectedSet);
    selectedList.textContent = list.length ? list.slice(0,10).join(', ') : '—';
    // compute total
    let total = 0;
    list.forEach(id => {
      const el = document.querySelector(`.seat[data-sid="${id}"]`);
      if(el) total += Number(el.dataset.price || basePrice);
    });
    document.getElementById('totalPrice').textContent = `$${total.toFixed(2)}`;
  }

  clearBtn.addEventListener('click', ()=>{
    selectedSet.clear();
    document.querySelectorAll('.seat.selected').forEach(s=>{ s.classList.remove('selected'); s.classList.add('available') });
    refreshSelectionUI();
  });

  reserveBtn.addEventListener('click', ()=>{
    if(selectedSet.size===0) return alert('Select at least one seat');
    // simulate reservation: mark selected seats occupied
    document.querySelectorAll('.seat.selected').forEach(s=>{
      const id = s.dataset.sid;
      s.classList.remove('selected');
      s.classList.add('reserved');
      reservedSet.add(id);
    });
    selectedSet.clear();
    refreshSelectionUI();
    alert('Reserved. This is a demo — integrate with backend to persist.');
  });

  if(compactReserve) compactReserve.addEventListener('click', ()=> reserveBtn.click());

  window.addEventListener('resize', ()=>{
    // re-render layout on breakpoint changes
    render();
  });

  // initial render
  render();
})();

