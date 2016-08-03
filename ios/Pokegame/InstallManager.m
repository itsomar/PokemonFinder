//
//  InstallManager.m
//  Pokegame
//
//  Created by Omar Rodriguez on 8/3/16.
//  Copyright © 2016 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>

#import "InstallManager.h"
#import "RCTBridge.h"
#import "RCTEventDispatcher.h"

@implementation InstallManager

RCT_EXPORT_MODULE();

- (void)startObserving {
  [[NSNotificationCenter defaultCenter] addObserver:self
                                         selector:@selector(sendDeviceToken:)
                                             name:@"InstallNotification"
                                           object:nil];
}

- (void)stopObserving {
  [[NSNotificationCenter defaultCenter] removeObserver:self];
}

- (NSArray<NSString *> *)supportedEvents
{
  return @[@"InstallEvent"];
}

- (void)sendDeviceToken: (NSNotification *) notification {
  NSLog(@"sendDeviceToken called, %@", notification.userInfo[@"deviceToken"]);
  [self sendEventWithName:@"InstallEvent" body:@{@"token": notification.userInfo[@"deviceToken"]}];
}

@end