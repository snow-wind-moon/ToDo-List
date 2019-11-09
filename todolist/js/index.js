var bus = new Vue()

// Tab组件全局注册-标题栏

Vue.component('Tab',{
    template: '#tab',
    methods: {
        change_input_flag () {
            bus.$emit('input_flag_change')
        }
    }
})

// 主体部分

Vue.component('Container',{
    template: '#container',
    data () {
        return {
            input_flag: false
        }
    },
    props: ['todos','change_mask_flag'],
    methods: {
        changeContainerFlag ( index ) {
            this.$emit('change_flag',index )
        },
        checkDone ( index ) {
            this.$emit( 'check',index )
        },
        add ( e ) {
            this.$emit('add_item',e.target.value )
            this.input_flag = false
        }
    },
    mounted () {
        var that = this
        bus.$on('input_flag_change', function () {
            that.input_flag = !that.input_flag
        })
    }
})

Vue.component('MyMask',{
    template: '#mask',
    props: ['close_mask','active_index','remove'],
    methods: {
        confirm () {
            this.close_mask(),
            this.remove( this.active_index )
        }
    }
})

// 底部导航

Vue.component('TabBar',{
    template: '#tabbar',
    props: ['type'],
    data () {
        return {
            tabbars: [
                {
                    id: 1,
                    text: 'A',
                    class: 'circle-success'
                },
                {
                    id: 2,
                    text: 'F',
                    class: 'circle-primary'
                },
                {
                    id: 3,
                    text: 'U',
                    class: 'circle-danger'
                }
            ]
        }
    },
    methods: {
        changeType ( val ) {
            this.$emit('get_type',val)
        }
    }
})

// 实例

new Vue({
    el: '#app',
    data:{
        mask_flag: false,
        active_index: 0,
        type: 'A',
        todos: [
            {
                id: 1,
                task: '任务一',
                done: true //done 表示任务是否已完成
            },
            {
                id: 2,
                task: '任务二',
                done: true
            }
        ]
    },
    methods: {
        changeFlag ( index ) {
            this.todos[ index ].done = !this.todos[ index ].done
        },
        check ( index ) {
            const flag = this.todos[index].done
            if ( flag ) {
                this.remove( index )
            } else {
                this.active_index = index
                this.changeMaskFlag()
            }
        },
        remove ( index ) {
            this.todos.splice( index, 1 )
        },
        changeMaskFlag () {
            this.mask_flag = true
        },
        closeMask () {
            this.mask_flag = false
        },
        addItem ( val ) {
            this.todos.push({
                id: sort( this.todos )[ 0 ].id + 1,
                task: val,
                done: true
            })
        },
        changeType ( val ) {
            this.type = val 
        }
    },
    computed: {
        newTodos () {
            switch ( this.type ) {
                case 'A':
                    return this.todos
                    break;
                case 'F':
                    return this.todos.filter( item => item.done )
                    break;
                case 'U':
                    return this.todos.filter( item => !item.done )
                    break;

                default:
                    break;
            }
        }
    }
})

// 数组根据 id 降序，将最大的 id 找到，然后加 1

function sort ( arr ) {
    return arr.sort( function ( a,b ) {
        return b.id-a.id
    })
}