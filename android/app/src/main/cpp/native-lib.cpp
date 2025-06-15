#include <jni.h>
#include <string>
#include "whisper.h"

whisper_context* ctx = nullptr;

extern "C"
JNIEXPORT jboolean JNICALL
Java_com_yourapp_WhisperModule_loadModel(JNIEnv* env, jobject /* this */, jstring modelPath) {
    const char* path = env->GetStringUTFChars(modelPath, nullptr);
    ctx = whisper_init_from_file(path);
    env->ReleaseStringUTFChars(modelPath, path);

    return (ctx != nullptr) ? JNI_TRUE : JNI_FALSE;
}