<?php

namespace PicFix;

use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    //

    public function order()
    {
        return $this->belongsTo('PicFix\Order');
    }
}
