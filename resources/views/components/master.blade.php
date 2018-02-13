<a href="#popup" class="item" :class="{active: masterdetail.id == '{{$id}}'}" @click="masterClick('{{$id}}')">
    {{$slot}}
</a>