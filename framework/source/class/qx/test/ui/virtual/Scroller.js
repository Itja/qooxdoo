/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2009 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
   * Fabian Jakobs (fjakobs)

************************************************************************ */

qx.Class.define("qx.test.ui.virtual.Scroller",
{
  extend : qx.test.ui.LayoutTestCase,

  members :
  {
    setUp : function()
    {
      this.base(arguments);
            
      var scroller = new qx.ui.virtual.core.Scroller(1, 1, 10, 10);
      this.getRoot().add(scroller);
      this.scroller = scroller;
      qx.ui.core.queue.Manager.flush();
    },
    
    tearDown : function()
    {
      this.scroller.destroy();      
      this.base(arguments);
      qx.ui.core.queue.Manager.flush();
    },
    
    assertScrollbars : function(hasScrollX, hasScrollY, msg)
    {
      this.assertEquals(
        hasScrollX, 
        this.scroller.getChildControl("scrollbar-x").isVisible(),
        msg
      );
      this.assertEquals(
        hasScrollY,
        this.scroller.getChildControl("scrollbar-y").isVisible(),
        msg
      );
    }, 
    
    configureScroller : function(scrollWidth, scrollHeight, width, height)
    {
      this.scroller.set({
        width: width,
        height: height
      });
      this.scroller.pane.rowConfig.setItemSize(0, scrollHeight);
      this.scroller.pane.columnConfig.setItemSize(0, scrollWidth);
      
      // trigger update manually
      this.scroller.pane.fullUpdate();
      qx.ui.core.queue.Manager.flush();
    },
    
    testConstructor : function() {
      this.assertNotUndefined(this.scroller);
    },       
    
    testScrollX : function()
    {
      this.scroller.setScrollbarY("off");
      
      this.configureScroller(3000, 2000, 300, 200); 
      this.assertScrollbars(true, false);   
      
      this.assertEquals(0, this.scroller.getScrollX());
      this.assertEquals(0, this.scroller.pane.getScrollX());
      
      this.scroller.scrollToX(100);
      this.assertEquals(100, this.scroller.getScrollX());
      this.assertEquals(100, this.scroller.pane.getScrollX());

      this.scroller.scrollToX(3000);
      this.assertEquals(2999-300, this.scroller.getScrollX());
      this.assertEquals(2999-300, this.scroller.pane.getScrollX());
      
      this.configureScroller(3000, 2000, 3000, 2000);
      this.assertScrollbars(false, false);
      this.assertEquals(0, this.scroller.getScrollX());
      this.assertEquals(0, this.scroller.pane.getScrollX());      
    },
    
    testScrollY : function()
    {
      this.scroller.setScrollbarX("off");
      
      this.configureScroller(3000, 2000, 300, 200); 
      this.assertScrollbars(false, true);   
      
      this.assertEquals(0, this.scroller.getScrollX());
      this.assertEquals(0, this.scroller.pane.getScrollX());
      
      this.scroller.scrollToY(100);
      this.assertEquals(100, this.scroller.getScrollY());
      this.assertEquals(100, this.scroller.pane.getScrollY());

      this.scroller.scrollToY(2000);
      this.assertEquals(1999-200, this.scroller.getScrollY());
      this.assertEquals(1999-200, this.scroller.pane.getScrollY());
      
      this.configureScroller(3000, 2000, 3000, 2000);
      this.assertScrollbars(false, false);
      this.assertEquals(0, this.scroller.getScrollY());
      this.assertEquals(0, this.scroller.pane.getScrollY());      
    },    
    
    testScrollbarYAuto : function()
    {
      this.scroller.setScrollbarX("off");
      this.scroller.setScrollbarY("auto");
      
      // pane and widget have equal size
      this.configureScroller(300, 200, 300, 200);  
      this.assertScrollbars(false, false);

      // pane larger than widget
      this.configureScroller(300, 201, 300, 200);      
      this.assertScrollbars(false, true);
      
      // widget larger than pane
      this.configureScroller(300, 201, 300, 202);      
      this.assertScrollbars(false, false);

      
      // scroll y must be hidden all the time
      this.configureScroller(301, 200, 300, 200);      
      this.assertScrollbars(false, false);
    },
    
    testScrollbarXAuto : function()
    {
      this.scroller.setScrollbarX("auto");
      this.scroller.setScrollbarY("off");
      
      // pane and widget have equal size
      this.configureScroller(300, 200, 300, 200);  
      this.assertScrollbars(false, false);

      // pane larger than widget
      this.configureScroller(301, 200, 300, 200);      
      this.assertScrollbars(true, false);
      
      // widget larger than pane
      this.configureScroller(301, 200, 302, 200);      
      this.assertScrollbars(false, false);

      
      // scroll x must be hidden all the time
      this.configureScroller(300, 201, 300, 200);      
      this.assertScrollbars(false, false);      
    },
    
    testScrollbarXYAuto : function()
    {
      // pane and widget have equal size
      this.configureScroller(300, 200, 300, 200);  
      this.assertScrollbars(false, false);
      
      // increase the pane a bit -> both scrollbars are needed
      this.configureScroller(301, 200, 300, 200);  
      this.assertScrollbars(true, true);
      
      // reset
      this.configureScroller(300, 200, 300, 200);
      this.assertScrollbars(false, false);
      
      this.configureScroller(300, 201, 300, 200);  
      this.assertScrollbars(true, true);
      
      // increase scroller height
      this.configureScroller(300, 201, 300, 250);
      this.assertScrollbars(false, false);

      // increase scroller width
      this.configureScroller(300, 201, 350, 250);
      this.assertScrollbars(false, false);      
    }    
  }
});
