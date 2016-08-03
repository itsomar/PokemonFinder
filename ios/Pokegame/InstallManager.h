//
//  InstallManager.h
//  Pokegame
//
//  Created by Omar Rodriguez on 8/3/16.
//  Copyright © 2016 Facebook. All rights reserved.
//

#import "RCTEventEmitter.h"
@interface InstallManager : RCTEventEmitter

- (void) sendDeviceToken: (NSString *) deviceToken;

@end