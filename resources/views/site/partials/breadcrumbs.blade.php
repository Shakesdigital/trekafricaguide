<ul class="breadcrumb">
    @foreach($items as $item)
        <li>
            @if(!empty($item['href']))
                <a href="{{ $item['href'] }}">{{ $item['label'] }}</a>
            @else
                <span class="is-current">{{ $item['label'] }}</span>
            @endif
        </li>
    @endforeach
</ul>
