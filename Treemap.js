class Treemap{
    maxNth = 10;
    constructor(){
        // this.maxNth = 10;
    }

    createTreemapG(val,el,idx,isLast){
        // <div class="treemap-g  treemap-g-column" style="--vi:3;">
        //     <div class="treemap-b treemap-b-item">
        //         <div class="treemap-item" data-val="3">3</div>
        //     </div>
        //     <div class="treemap-b treemap-b-other">
        //         <div class="treemap-item" data-val="2">2</div>
        //     </div>
        // </div>
        let g = document.createElement('div');
        g.classList.add('treemap-g',(idx%2==0)?'treemap-g-row':'treemap-g-column','nth-'+(idx%this.maxNth));
        g.style.setProperty('--vi', val);
        let bi = document.createElement('div');
        bi.classList.add('treemap-b','treemap-b-item','nth-'+(idx%this.maxNth));
        bi.append(el);
        let bo = document.createElement('div');
        bo.classList.add('treemap-b','treemap-b-other');
        g.__treemap = { "bi":bi, "bo":bo, };
        g.appendChild(bi);
        g.appendChild(bo);
        return g;
    }
    sync(treemap_wrap){
        let el_treemap = treemap_wrap.querySelector('.treemap');
        el_treemap.innerHTML = '';
        let el_items = treemap_wrap.querySelectorAll('.treemap-items .treemap-item');
        let items = [];
        let total = 0;
        el_items.forEach(el => {
            if(!el || !el.dataset || el.dataset.val === undefined){ throw new Error('not exits @data-val'); }
            let val = parseFloat(el.dataset.val);
            if(isNaN(val)){ throw new Error('@data-val is not numeric'); }
            let item = {
                "val":val,
                "el":el,
            }
            total += val;
            items.push(item);
        });
        el_treemap.style.setProperty('--total', total);

        let el_current = el_treemap;
        console.log(total,items);
        items.forEach((item,idx) => {
            let g = this.createTreemapG(item.val,item.el,idx);
            el_current.append(g);
            el_current = g.querySelector('.treemap-b-other');
        });
    }
}