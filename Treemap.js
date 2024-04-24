/** @class */
class Treemap{
    
    /**
     * nth limit 수 10이면 nth-0 ~ nth-9 를 반복함
     * @member {int}
     */
    maxNth = 10;
    
    /**
     * 처음 시작 방향. 0:row, 1:column
     * @member {int}
     */
    startDir = 0;
    
    /**
     * 방향을 바꾸는 비율. 0~1 사이의 수. 0 이면 row, column 이 번갈아가면서, 1이면 한 방향으로만.
     * @member {float}
     */
    ratioDir = 1/3;

    constructor(){
        // this.maxNth = 10;
    }

    /**
     * treemap-g 요소를 생성
     * @param {any} val 
     * @param {HTMLElement} el 
     * @param {int} idx 
     * @param {int} dir 
     * @returns {HTMLElement}
     */
    createTreemapG(val,el,idx,dir){
        // <div class="treemap-g  treemap-g-dir-0" style="--vi:3;">
        //     <div class="treemap-b treemap-b-item">
        //         <div class="treemap-item" data-val="3">3</div>
        //     </div>
        //     <div class="treemap-b treemap-b-other">
        //         <div class="treemap-item" data-val="2">2</div>
        //     </div>
        // </div>
        let g = document.createElement('div');
        g.classList.add('treemap-g','treemap-g-dir-'+dir,'nth-'+(idx%this.maxNth));
        g.style.setProperty('--vi', val);
        let bi = document.createElement('div');
        bi.classList.add('treemap-b','treemap-b-item','nth-'+(idx%this.maxNth));
        bi.append(el.cloneNode(true));
        let bo = document.createElement('div');
        bo.classList.add('treemap-b','treemap-b-other');
        g.__treemap = { "bi":bi, "bo":bo, };
        g.appendChild(bi);
        g.appendChild(bo);
        return g;
    }
    /**
     * 트리맵 싱크 맞춰서 다시 그림
     * @param {*} treemap_wrap HTMLElement
     * @param {*} options {startDir:0 or 1, ratioDir:1/3}
     */
    sync(treemap_wrap,options={}){
        let startDir = options.startDir??this.startDir;
        let ratioDir = options.ratioDir??this.ratioDir;

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
        // console.log(total,items);
        let dir = startDir;
        let curr_sum = 0;
        let curr_total = total;
        items.forEach((item,idx) => {
            // let dir = idx;
            // dir = Math.floor(Math.random()*2);
            

            let g = this.createTreemapG(item.val,item.el,idx,dir);
            el_current.append(g);
            el_current = g.querySelector('.treemap-b-other');

            curr_sum+= item.val;
            if(curr_sum > curr_total*ratioDir){ // 방향 바꾸기 체크
                dir = (dir+1)%2; //방향 바꿈

                curr_total = curr_total - curr_sum;
                curr_sum = 0;
            }
        });
    }
}