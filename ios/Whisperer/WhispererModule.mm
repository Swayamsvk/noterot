//
//  Whisperer.m
//  
//
//  Created by Swayam Samyak Debasis on 08/06/25.
//
#import "WhispererModule.h"
#include "whisper.h"


whisper_context *ctx = NULL;

@implementation WhispererModule

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(loadModel:(NSString *)modelPath
                    resolver:(RCTPromiseResolveBlock)resolve
                    rejecter:(RCTPromiseRejectBlock)reject)
{
  // Ensure the modelPath is valid before proceeding
  if (!modelPath) {
    reject(@"invalid_path", @"Model path cannot be null", nil);
    return;
  }

  // Check if context already exists and free it if necessary
  if (ctx) {
    whisper_free(ctx);
    ctx = NULL;
  }

  ctx = whisper_init_from_file([modelPath UTF8String]);
  if (ctx) {
    resolve(@{"status": @"Model loaded successfully", @"path": modelPath});
  } else {
    reject(@"load_fail", @"Unable to load model", nil);
  }
}

// Required for RCTEventEmitter
- (NSArray<NSString *> *)supportedEvents
{
  return @[]; // No events currently, but required if inheriting from RCTEventEmitter
}

@end

