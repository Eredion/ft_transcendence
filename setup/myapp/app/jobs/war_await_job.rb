class WarAwaitJob < ApplicationJob
  queue_as :default

  def perform(war)
    if (war.startdate == Date.today)
      WarStartJob.perform_later(war)
    else
      WarStartJob.set(wait_until: war.startdate).perform_later(war)
    end
    # Do something later
  end
end
