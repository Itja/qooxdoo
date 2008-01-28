/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2008 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Jonathan Rass (jonathan_rass)

   ======================================================================

   This class contains code based on the following work:

   * script.aculo.us
       http://script.aculo.us/
       Version 1.8.1

     Copyright:
       (c) 2008 Thomas Fuchs

     License:
       MIT: http://www.opensource.org/licenses/mit-license.php

     Author:
       Thomas Fuchs

************************************************************************ */

/**
 * TODO
 */
qx.Class.define("qx.fx.Parallel",
{

  extend : qx.fx.Base,
  
  /*
    *****************************************************************************
       CONSTRUCTOR
    *****************************************************************************
  */

  construct : function(effects)
  {
    this.base(arguments);
    this._effects = (qx.util.Validation.isValidArray(effects)) ? effects : []; 
  },

  
  /*
  *****************************************************************************
     STATICS
  *****************************************************************************
  */

  statics :
  {
  },

  /*
   *****************************************************************************
      MEMBERS
   *****************************************************************************
   */

   members :
   {
    finish : function(position)
    {
      for(var effect in this._effects)
      {
        effect.render(1.0);
        effect.cancel();
  
        effect.beforeFinishInternal();
        effect.beforeFinish();
  
        effect.finish(position);
  
        effect.afterFinishInternal();
        effect.afterFinish();
      }
    },
    
    update : function(position)
    {
      for (var effect in this._effects) {
        effect.render(position);
      }
    }

   },

  /*
  *****************************************************************************
     DEFER
  *****************************************************************************
  */

  defer : function(statics) {
    
  }
});