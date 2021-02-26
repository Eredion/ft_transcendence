class WarAwaitJob < ApplicationJob
  queue_as :default

  def perform(war)
    (0..war.duration).each do |n|
      wartime = war.startdate + war.wartimehour.hours + n.days
      #wartime = Time.now + n.days
      if (n == 0 && wartime < Time.now && wartime > Time.now - 1.hours)
        WarTimeOnJob.perform_later(war)                           ## war was started inside wartime
      elsif (n == 0 && wartime < Time.now && wartime < Time.now - 1.hours)
        puts "no wartime today"                                   ## first day of war has no wartime
      else
        WarTimeOnJob.set(wait_until: wartime).perform_later(war)  ## normal wartime
      end
      WarTimeOffJob.set(wait_until: wartime + 1.hours).perform_later(war)
    end
    if (war.startdate == Date.today)
      WarStartJob.perform_later(war)
    else
      WarStartJob.set(wait_until: war.startdate).perform_later(war)
    end
    # Do something later
  end
end
