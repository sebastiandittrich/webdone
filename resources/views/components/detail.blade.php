<div
    @if ($id == 'null')
        v-show="masterdetail.id == null"
    @else
        v-show="masterdetail.id == '{{$id}}'"
    @endif
    >
    <div @click="detailBackClick()" class="header">
        <i class="mi mi-chevronleftsmlegacy"></i><div class="text">{{$title}}</div>
    </div>
    {{$slot}}
</div>