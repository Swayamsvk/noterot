package com.noterot

import com.facebook.react.bridge.*
import com.facebook.react.module.annotations.ReactModule

@ReactModule(name = WhispererModule.NAME)
class WhispererModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName() = NAME

    companion object {
        const val NAME = "WhispererModule"
        init {
            System.loadLibrary("whisper") // C++ lib
        }
    }

    private external fun whisperLoadModel(path: String): Boolean

    @ReactMethod
    fun loadModel(path: String, promise: Promise) {
        val result = whisperLoadModel(path)
        if (result) promise.resolve(null)
        else promise.reject("LOAD_ERROR", "Model load failed")
    }
}
