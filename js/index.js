// 文本框里面输入内容，按下回车，就可以生成待办事项。
// 点击待办事项复选框，就可以把当前数据添加到已完成事项里面。
// 点击已完成事项复选框，就可以把当前数据添加到待办事项里面。
// 但是本页面内容刷新页面不会丢失。
const ipt=document.querySelector('.query')
const btn=document.querySelector('.sub')
const backlog=document.querySelector('.backlog')
const success=document.querySelector('.success')
// const as=document.querySelectorAll('a');
//当页面元素加载完成，先渲染一遍
load();
btn.addEventListener('click',function(){
    let value=ipt.value;
    if(value.trim()===''){
      alert('请输入待办事项')
    }else{
        //读取本地存储内容
        let local=getLocal();
        //将新内容追加给本地存储里:先追加给对象，对象再转化为字符串放入本地存储
        local.push({title:value,done:false})
        //保存数据在本地
        saveLocal(local)
       //渲染数据
        load();
        ipt.value=""
    }
})
//读取本地存储内容
function getLocal(){
    let data = localStorage.getItem("todolist")
    if(data!==null){
        return JSON.parse(data)
    }else{
        return [];
    }
}
//放入本地存储，注意形参的使用
function saveLocal(data){
    localStorage.setItem("todolist",JSON.stringify(data));
}
//渲染加载数据函数
function load(){
    //每一次渲染数据先把列表清空
    backlog.innerHTML='';
    success.innerHTML='';
    //得到本地存储的数据
    let data = getLocal();
    //遍历data数据
    data.forEach((item,index)=>{
        //创建li元素
        let li=document.createElement('li');
        //设置li的标签内容
        li.innerHTML=`<input type="checkbox"/><i id="${index}">${item.title}</i><a href="javascript:;" id="${index}">.</a>`
        //判断item中的done的值是true还是false
        if(item.done){
            //是true，说明已经点击，则将数据传入ul列表中去
            success.insertBefore(li,success.children[0])
            //把input的复选状态选中
            li.children[0].checked='checked'
        }else{
            //如是false说明未点击，将数据传入backlog列表中去
            backlog.insertBefore(li,backlog.children[0]);
        }
    })
}
//编辑数据
function bianji(){
    backlog.addEventListener('dblclick',function(e){
        //获取i标签
        let i=e.target;
        //如果获取的元素名字是i
        if(e.target.nodeName=='I'){
            //设置i的html
            i.innerHTML=`<input type="text" value="${i.innerHTML}" id="${i.id}">`
            //点击后，使每个子级选中
            i.children[0].select();
            //当焦点失去时，获取数据，截取字符串，将当前编辑好的数据修改
            i.children[0].addEventListener('blur',function(e){
                //获取数据
                let shuju=getLocal();
                //截取字符串下标是1
                let I=i.id;
                //将当前编辑好的数据修改
                shuju[I].title=this.value;
                //保存数据
                saveLocal(shuju);
                //重新加载数据
                load();
            })
        }
    })
}
bianji();
//删除数据
function shanchu(){
    success.addEventListener('click',function(e){
        let p = e.target;
        if(p.nodeName=='A'){
            let i = p.id
            let data = getLocal();
            data.splice(i,1)
            saveLocal(data);
            load()
        }
    })
}
shanchu();
//切换正在进行完成
//传入两个参数 第一个是列表(backlog/success) 第二个是传入的值判断是true还是false(适用于上下传切换)
function change(teml,tell){
    teml.addEventListener('click',function(e){
        let input = e.target
        if(input.nodeName=='INPUT'){
            let i = input.nextElementSibling.id
            let data = getLocal()
            data[i].done=tell;
            saveLocal(data);
            load();
        }
    })
}
change(backlog,true)
change(success,false)