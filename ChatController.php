<?php

namespace PicFix\Http\Controllers;

use PicFix\Events\ChatEvent;
use PicFix\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ChatController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function chat()
    {
        return view('chat');
    }

    public function send(Request $request)
    {
        $user = User::findorfail(Auth::id());

        $this->saveToSession($request);
        event(new ChatEvent($request->message,$user));
    }
    public function saveToSession(Request $request)
    {
        session()->put('chat',$request->chat);
    }

    public function getOldMessage()
    {
		if(session('chat')){
            return session('chat');
        }
		   return null;

    }

    public function deleteSession()
    {
        session()->forget('chat');
    }
}
